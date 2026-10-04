Você tem razão. Faltou o comando específico para **gerar/assinar o certificado da Intermediate**.

Como a chave da Intermediate será usada pelo `cert-manager`, vamos considerar que ela foi gerada **sem passphrase**:

```bash
openssl genrsa \
  -out intermediate-ca/private/intermediate-ca.key.pem \
  4096
```

Depois, gere o CSR:

```bash
openssl req \
  -new \
  -sha256 \
  -key intermediate-ca/private/intermediate-ca.key.pem \
  -out intermediate-ca/intermediate-ca.csr.pem \
  -config intermediate-ca/openssl.cnf
```

Agora vem o que estava faltando: **a Root CA assina o CSR e gera o certificado da Intermediate**.

### 1. Configuração das extensões

Crie:

```bash
cat > intermediate-ca/sign-intermediate.cnf <<'EOF'
[ intermediate_ca ]
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, keyCertSign, cRLSign
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
EOF
```

### 2. Gerar o certificado da Intermediate

Execute a partir de `~/homelab-pki`:

```bash
openssl x509 \
  -req \
  -sha256 \
  -days 1825 \
  -in intermediate-ca/intermediate-ca.csr.pem \
  -CA root-ca/certs/root-ca.cert.pem \
  -CAkey root-ca/private/root-ca.key.pem \
  -CAcreateserial \
  -out intermediate-ca/certs/intermediate-ca.cert.pem \
  -extfile intermediate-ca/sign-intermediate.cnf \
  -extensions intermediate_ca
```

Aqui:

* `-req` → usa o CSR da Intermediate;
* `-CA` → usa nossa Root CA;
* `-CAkey` → usa a chave privada da Root;
* `-days 1825` → 5 anos;
* `-extfile` → define que a Intermediate é uma CA;
* `pathlen:0` → ela pode assinar certificados finais, mas não outra CA.

A senha solicitada será **somente a da Root CA**, porque estamos usando a Root para assinar a Intermediate.

### 3. Verifique o certificado gerado

```bash
openssl x509 \
  -in intermediate-ca/certs/intermediate-ca.cert.pem \
  -noout \
  -subject \
  -issuer \
  -dates
```

Deve aparecer algo semelhante a:

```text
subject=C=BR, O=Homelab, OU=Infrastructure, CN=Homelab TLS Intermediate CA
issuer=C=BR, O=Homelab, OU=Infrastructure, CN=Homelab Root CA
```

E confirme as extensões:

```bash
openssl x509 \
  -in intermediate-ca/certs/intermediate-ca.cert.pem \
  -noout \
  -text
```

Você deve encontrar:

```text
X509v3 Basic Constraints: critical
    CA:TRUE, pathlen:0

X509v3 Key Usage: critical
    Certificate Sign, CRL Sign
```

### 4. Valide a cadeia

```bash
openssl verify \
  -CAfile root-ca/certs/root-ca.cert.pem \
  intermediate-ca/certs/intermediate-ca.cert.pem
```

Resultado esperado:

```text
intermediate-ca/certs/intermediate-ca.cert.pem: OK
```

Depois disso, teremos exatamente:

```text
Root CA
  │
  │ RSA 4096 / 10 anos
  │
  ▼
TLS Intermediate CA
  │
  │ RSA 4096 / 5 anos
  │
  ▼
cert-manager
  │
  ├── ArgoCD      → 90 dias
  ├── Grafana     → 90 dias
  └── Prometheus  → 90 dias
```

E **só a chave da Intermediate + seu certificado** irão para o Secret do `cert-manager`.
