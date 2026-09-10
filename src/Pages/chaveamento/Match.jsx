function Match({jogo}){


return (

<div className="match">


<div>

{jogo.time1?.Nome || "TIME"}

</div>


<span>
VS
</span>


<div>

{jogo.time2?.Nome || "TIME"}

</div>


</div>

)

}


export default Match;