
const nome = document.querySelector(".nome");
const personagem = document.querySelector(".personagem");
const avatarUsuario = document.querySelector(".avatar-usuario");
const botaoVoce = document.querySelector(".voce");
const mensagem = document.querySelector(".mensagem");

let gerando = false;

function escolherPersonagem(nomePersonagem, imagemPersonagem, cor) {
    nome.textContent = nomePersonagem;
    personagem.src = imagemPersonagem;
    nome.style.color = cor;
}

function destacarPersonagem(avatar) {
    personagem.classList.add("em-destaque");

    avatar.style.borderColor = "#65ff8f";
    avatar.style.boxShadow = "0 0 15px rgba(101, 255, 143, 0.85)";
}

function removerDestaque() {
    personagem.classList.remove("em-destaque");

    document.querySelectorAll(".avatar").forEach((avatar) => {
        avatar.style.borderColor = "";
        avatar.style.boxShadow = "";
    });
}

async function lerFoto(input) {
    const foto = input.files[0];

    if (!foto || gerando) return;

    if (!foto.type.startsWith("image/")) {
        mensagem.textContent = "Selecione um arquivo de imagem válido.";
        input.value = "";
        return;
    }

    gerando = true;
    input.disabled = true;
    mensagem.textContent = "Criando seu personagem...";

    try {
        const fotoBase64 = await new Promise((resolve, reject) => {
            const leitor = new FileReader();

            leitor.onload = () => resolve(leitor.result);
            leitor.onerror = () => reject(
                new Error("Não foi possível ler a foto.")
            );

            leitor.readAsDataURL(foto);
        });

        const desenho = await puter.ai.txt2img(
            "Transforme a pessoa desta foto em um personagem de videogame: contorno preto grosso, cores vivas, meio corpo, mantendo o rosto parecido. Fundo totalmente transparente: sem cenário, sem chão e sem sombra.",
            {
                model: "replicate:openai/gpt-image-2.5-flare",
                provider: "openai",
                input_image: fotoBase64,
                quality: "medium",
                providerOptions: {
                    background: "transparent"
                }
            }
        );

        let imagemGerada;

        if (typeof desenho === "string") {
            imagemGerada = desenho;
        } else if (desenho instanceof HTMLImageElement) {
            imagemGerada = desenho.src;
        } else if (desenho instanceof HTMLCanvasElement) {
            imagemGerada = desenho.toDataURL("image/png");
        } else {
            throw new Error("A IA não retornou uma imagem reconhecida.");
        }

        avatarUsuario.src = imagemGerada;
        botaoVoce.classList.add("tem-foto");

        escolherPersonagem("Você", imagemGerada, "#65ff8f");

        mensagem.textContent = "";

    } catch (erro) {
        console.error("Erro ao gerar personagem:", erro);
    } finally {
        gerando = false;
        input.disabled = false;
        input.value = "";
    }
}
