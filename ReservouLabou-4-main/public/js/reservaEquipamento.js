const formulario = document.querySelector("form");

formulario.addEventListener(

"submit",

e=>{

    const quantidades =

    document.querySelectorAll(

        "input[type='number']"

    );

    let total = 0;

    quantidades.forEach(campo=>{

        total += Number(campo.value);

    });

    if(total===0){

        e.preventDefault();

        alert(

            "Selecione pelo menos um equipamento."

        );

    }

});
