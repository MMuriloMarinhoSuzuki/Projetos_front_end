
function clickbtn() {
    let user = document.getElementById("user").value;
    let senha = document.getElementById("senha").value;

    if (user === "Admin" || senha === 4321) {
        document.getElementById("resultado").innerText = "Usuário correto";
    } else {
        document.getElementById("resultado").innerText = "Usuário incorreto";
    }

}