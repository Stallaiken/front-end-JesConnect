import {useState,useEffect} from "react";
import {supabase} from "../supabaseClient";
import "../css/Chaveamento.css";

import Bracket from "../components/Chaveamento/Bracket";


function Chaveamento(){

const [modalidades,setModalidades]=useState([]);

const [modalidadeId,setModalidadeId]=useState("");

const [times,setTimes]=useState([]);

const [chave,setChave]=useState([]);


useEffect(()=>{

async function carregarModalidades(){

const {data,error}=await supabase
.from("modalidade")
.select("id,nome,genero")
.order("nome");


if(!error){
setModalidades(data);
}

}


carregarModalidades();


},[]);




async function carregarTimes(){


const {data,error}=await supabase
.from("time")
.select("*")
.eq(
"id_modalidade",
modalidadeId
);



if(!error){

setTimes(data);

}


}




function gerarChaveamento(){


let lista=[...times];


// embaralhar

lista.sort(
()=>Math.random()-0.5
);



let jogos=[];



for(let i=0;i<lista.length;i+=2){


jogos.push({

time1:lista[i],

time2:lista[i+1] || null

});


}



setChave(jogos);



}



return (

<div className="chaveamento-container">


<h1>
CHAVEAMENTO
</h1>



<select

value={modalidadeId}

onChange={(e)=>{

setModalidadeId(e.target.value)

}}

>


<option>
Escolha modalidade
</option>


{
modalidades.map((m)=>(

<option
key={m.id}
value={m.id}
>

{m.nome}

</option>


))
}



</select>



<button
onClick={carregarTimes}
>
Carregar Times
</button>



<button
onClick={gerarChaveamento}
>
Gerar Chave
</button>



<Bracket

jogos={chave}

/>



</div>


)


}


export default Chaveamento;