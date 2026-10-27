# SATS OS — protótipo inicializável por USB

Este diretório inicia a transição do app Electron para uma imagem Linux testável. **Ainda não é uma ISO pronta**: ela precisa ser construída em uma máquina Debian/Ubuntu compatível e testada no hardware antes de qualquer instalação.

## Objetivo desta etapa

- Usar Debian Live como base, sem apagar o ChromeOS.
- Incluir ambiente gráfico XFCE, rede, áudio, ferramentas básicas e Node.js/npm.
- Testar a inicialização e compatibilidade do Chromebook por USB.
- Depois, integrar o desktop Electron do SATS ao login gráfico; isso é uma etapa separada para evitar deixar a primeira ISO sem interface utilizável.

## Segurança primeiro

1. Faça backup dos arquivos importantes.
2. **Não ative o modo desenvolvedor, não desative a verificação do sistema e não instale no armazenamento interno só para testar.**
3. Use um computador Linux Debian/Ubuntu para construir a ISO. O ambiente Linux do ChromeOS pode não ter permissões/dispositivos suficientes para criar mídia inicializável.
4. Use um pendrive vazio de pelo menos 8 GB. A gravação apaga tudo que estiver nele.
5. Primeiro teste apenas em modo live/USB. Não escolha instalação no disco.
6. A inicialização por USB depende do modelo e das restrições do Chromebook. Alguns modelos exigem configurações de firmware específicas; não altere essas opções sem confirmar o modelo e entender como restaurar o ChromeOS.

## Construir uma ISO de teste

Em um sistema Debian/Ubuntu dedicado ou máquina virtual Linux com internet:

```bash
sudo apt update
sudo apt install -y live-build debootstrap git ca-certificates
cd os-image
sh auto/config
sudo lb build
```

O comando final pode demorar e requer espaço livre considerável. O artefato normalmente será um arquivo ISO no diretório atual. Se o comando falhar, guarde as últimas linhas do erro antes de tentar novamente.

> A configuração mínima de pacotes está em `config/package-lists/sats.list.chroot`. Esta primeira imagem é uma base de teste Linux, não a versão final do SATS OS e ainda não inicia automaticamente o desktop Electron.

## Gravar e testar

- Grave a ISO com uma ferramenta confiável, como Balena Etcher ou Rufus, em um pendrive vazio.
- Confirme o modelo exato do Chromebook e as instruções oficiais de recuperação/boot do fabricante antes de tentar iniciar pelo USB.
- Escolha o dispositivo USB no menu de boot, se o modelo permitir.
- Selecione a opção live e teste Wi‑Fi, teclado, touchpad, áudio, brilho, suspensão e reinicialização.
- Saia sem instalar no disco. Se algo falhar, anote o modelo do Chromebook e o dispositivo que não funcionou.

## Próximas etapas do projeto

1. Criar e validar a ISO live base.
2. Adicionar o SATS desktop Electron como sessão de usuário com inicialização automática e fallback para XFCE.
3. Testar drivers, Wi‑Fi, áudio, touchpad e energia em hardware real.
4. Só depois considerar um instalador opcional, recuperação e atualizações seguras.

O SATS ainda não substitui o ChromeOS. Esta etapa prepara um caminho reversível para testar Linux por USB primeiro.