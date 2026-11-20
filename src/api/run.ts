const API_URL = import.meta.env.VITE_API_URL

type Resultat = {
    output? : string,
    error? : string
}

export async function runCode(code:string) : Promise<Resultat> {
    
    const response = await fetch(`${API_URL}/run`, {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'} ,
        body : JSON.stringify( { "code" : code } )
    }) 

    if(!response.ok) {
        throw new Error('Erreur serveur')
    }

    return response.json()
}

