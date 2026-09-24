const data = document.querySelector("[name='DataReserva']");
const entrada = document.querySelector("[name='HoraEntrada']");
const saida = document.querySelector("[name='HoraSaida']");
const lab = document.querySelector("[name='IdLab']");

async function atualizarHorarios(){

    if(

        !lab.value ||

        !data.value

    ) return;

    const resposta = await fetch(

        `/reservas/laboratorios/horarios?idLab=${lab.value}&data=${data.value}`

    );

    const horarios = await resposta.json();

    const div = document.getElementById("horariosOcupados");

    div.innerHTML="";

    horarios.forEach(item=>{

        div.innerHTML +=

        `<p>

        ${item.HoraEntrada}

        -

        ${item.HoraSaida}

        (ocupado)

        </p>`;

    });

}

lab.onchange = atualizarHorarios;
data.onchange = atualizarHorarios;
entrada.onchange = atualizarHorarios;
saida.onchange = atualizarHorarios;
