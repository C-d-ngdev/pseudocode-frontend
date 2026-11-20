import MonacoEditor from '@monaco-editor/react'
import { useState } from 'react'
import { runCode } from '../api/run'

export default function Editor(){
    const [code , setCode] = useState('')
    const [loading , setLoading] = useState(false)
    const [error , setError] = useState('')
    const [output , setOutput] = useState('')
    
    async function handleRun(){
        setLoading(true)
        setError('')
        setOutput('')

        try {
            const result = await runCode(code)
            if(result.error){
                setError(result.error)
            }else{
                setOutput(result.output ?? '')
            }
        } catch (e) {
            if(e instanceof TypeError){
                setError('Serveur injoignable !')
            }else if( e instanceof Error){
                setError(String(e.message))
            }
            
        } finally {
            setLoading(false)
        }


    }


    return(
        <div>
            <MonacoEditor
                height="300px"
                theme="vs-dark"
                value={code}
                onChange={(value)=> setCode(value ?? '')}
            />
            <button type='submit' onClick={handleRun} disabled={loading}>
                {loading ? 'Exécution...' : 'Exécuter'}
            </button>

            {error && <pre style={{color : 'red'}}>{error}</pre>}
            {output && <pre>{output}</pre>}

        </div>
    )
}