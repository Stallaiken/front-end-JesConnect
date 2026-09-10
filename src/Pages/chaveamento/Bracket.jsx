import Match from "./Match";


function Bracket({jogos}){


return (

<div className="bracket">


<div className="fase">

<h2>
QUARTAS
</h2>


{
jogos.map((jogo,index)=>(

<Match

key={index}

jogo={jogo}

/>

))

}


</div>


<div className="fase">

<h2>
SEMIFINAL
</h2>


<div className="match-vazio">

Aguardando

</div>


</div>



<div className="fase">

<h2>
FINAL
</h2>


<div className="match-vazio">

Aguardando

</div>


</div>


</div>


)


}


export default Bracket;