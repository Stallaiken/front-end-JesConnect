 
 const adminButton = ()=> {
    return(
        <>

         {isAdmin && (
        <>
          {menuAdminAberto && (
            <div
              style={{
                position: "fixed",
                right: "30px",
                bottom: "100px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                zIndex: 1000,
              }}
            >
              <button
                onClick={() => navigate("/editar-time")}
                style={{
                  padding: "12px 18px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,.2)",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Editar Time
              </button>

              <button
                onClick={() => navigate("/adicionar-time")}
                style={{
                  padding: "12px 18px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,.2)",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Adicionar Time
              </button>

              <button
                onClick={() => navigate("/adicionar-jogo")}
                style={{
                  padding: "12px 18px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,.2)",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Adicionar Confronto
              </button>

              <button
                onClick={() => {
                  setMenuAdminAberto(false);

                  alert("Para finalizar, clique diretamente na partida.");
                }}
                style={{
                  padding: "12px 18px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,.2)",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Finalizar
              </button>
            </div>
          )}

          <button
            onClick={() => setMenuAdminAberto((prev) => !prev)}
            style={{
              position: "fixed",
              bottom: "30px",
              right: "30px",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#2563eb",
              color: "white",
              fontSize: "32px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1001,
            }}
          >
            {menuAdminAberto ? "×" : "+"}
          </button>
        </>
      )}
        
     


        </>
    )
 } 
 
