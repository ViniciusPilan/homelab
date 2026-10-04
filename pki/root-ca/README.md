Sim. Vamos simplificar a Root CA e remover tudo relacionado a `openssl ca`, `database` e `serial`.

A Root CA será usada **somente para assinar a Intermediate CA** e ficará offline. Portanto, não precisamos de uma infraestrutura de emissão/revogação nela.

## 1. Estrutura

Na máquina offline:

```bash
mkdir -p ~/homelab-pki/root-ca/{private,certs}

cd ~/homelab-pki/root-ca

chmod 700 private
```

Teremos:

```text
root-ca/
├── certs/
├── private/
└── openssl.cnf
```

---

## 2. `openssl.cnf`

Crie:

```bash
cat > openssl.cnf <<'EOF'
[ req ]
default_md = sha256
prompt = no
distinguished_name = root_ca_subject
x509_extensions = root_ca_extensions

[ root_ca_subject ]
C  = BR
O  = Homelab
OU = Infrastructure
CN = Homelab Root CA

[ root_ca_extensions ]
basicConstraints = critical, CA:true, pathlen:1
keyUsage = critical, keyCertSign, cRLSign
subjectKeyIdentifier = hash
EOF
```

Essa configuração é deliberadamente pequena.

### O que estamos definindo

```ini
basicConstraints = critical, CA:true, pathlen:1
```

Significa:

* `CA:true` → é uma CA.
* `pathlen:1` → ela pode assinar uma CA intermediária, mas essa Intermediate não deve criar outra CA abaixo dela.

Nossa cadeia será:

```text
Root CA
   │
   └── Intermediate CA
          │
          ├── ArgoCD
          ├── Grafana
          └── Prometheus
```

Não:

```text
Root
  ↓
Intermediate
  ↓
Intermediate 2
  ↓
...
```

Já:

```ini
keyUsage = critical, keyCertSign, cRLSign
```

permite à Root:

* assinar certificados de CA;
* assinar CRLs.

---

# 3. Gerar a chave privada

Vamos usar **RSA 4096**.

```bash
openssl genrsa \
  -aes256 \
  -out private/root-ca.key.pem \
  4096
```

Será solicitada uma senha.

Essa senha protege a chave privada:

```text
private/root-ca.key.pem
```

Depois:

```bash
chmod 600 private/root-ca.key.pem
```

Verifique a chave:

```bash
openssl rsa \
  -in private/root-ca.key.pem \
  -check \
  -noout
```

Digite a senha.

Deve retornar:

```text
RSA key ok
```

---

# 4. Gerar o certificado Root CA

Agora usamos a própria chave para assinar o certificado da Root:

```bash
openssl req \
  -new \
  -x509 \
  -sha256 \
  -days 3650 \
  -key private/root-ca.key.pem \
  -out certs/root-ca.cert.pem \
  -config openssl.cnf
```

`3650` dias ≈ **10 anos**.

Novamente será solicitada a senha da chave.

---

# 5. Verificar o certificado

Primeiro:

```bash
openssl x509 \
  -in certs/root-ca.cert.pem \
  -noout \
  -subject \
  -issuer \
  -serial \
  -dates
```

Esperamos:

```text
subject=C=BR, O=Homelab, OU=Infrastructure, CN=Homelab Root CA
issuer=C=BR, O=Homelab, OU=Infrastructure, CN=Homelab Root CA
```

`subject` e `issuer` serem iguais é exatamente o que esperamos de uma Root CA autoassinada.

---

## 6. Verificar as extensões

Esse é um passo importante:

```bash
openssl x509 \
  -in certs/root-ca.cert.pem \
  -noout \
  -text
```

Procure:

```text
X509v3 Basic Constraints: critical
    CA:TRUE, pathlen:1

X509v3 Key Usage: critical
    Certificate Sign, CRL Sign
```

Também deverá existir:

```text
X509v3 Subject Key Identifier:
```

---

# 7. Verificar a cadeia da própria Root

Podemos verificar se o certificado é uma CA válida:

```bash
openssl verify \
  -CAfile certs/root-ca.cert.pem \
  certs/root-ca.cert.pem
```

Resultado esperado:

```text
certs/root-ca.cert.pem: OK
```

---

# 8. Obter o fingerprint

Eu recomendo registrar o fingerprint SHA-256:

```bash
openssl x509 \
  -in certs/root-ca.cert.pem \
  -noout \
  -fingerprint \
  -sha256
```

Guarde esse fingerprint junto com a documentação da sua PKI.

---

# 9. Resultado final

Sua Root CA ficará:

```text
root-ca/
├── certs/
│   └── root-ca.cert.pem       # certificado público
├── private/
│   └── root-ca.key.pem        # 🔴 segredo
└── openssl.cnf
```

A parte crítica é:

```text
root-ca.key.pem
```

**Essa chave nunca deve ir para o Kubernetes.**

Depois que criarmos a Intermediate CA, a Root poderá voltar para armazenamento offline e, idealmente, você só precisará acessá-la novamente quando houver necessidade de assinar uma nova Intermediate.

### Uma observação importante sobre `homelab.internal`

Não precisamos colocar `homelab.internal` no certificado da Root. Ele é a **CA**, não um certificado para um hostname.

Então:

```text
CN = Homelab Root CA
```

está correto.

O `homelab.internal` aparecerá nos certificados finais:

```text
argocd.homelab.internal
grafana.homelab.internal
```

e será tratado pelo `cert-manager`.

**Depois dessa etapa, o próximo passo é criar a `Homelab TLS Intermediate CA` usando essa Root.** Aí vale discutir cuidadosamente onde a chave privada da Intermediate ficará, porque essa é a chave que estará diretamente envolvida na emissão dos certificados de 90 dias.
