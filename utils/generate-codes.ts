type CodeExampleParams = {
    model: string
    messages: any[]
    maxTokens: number
    temperature: number
    stream: boolean
    onlineSearch: boolean
    location: string
  }
  
  export function generateCodeExample(language: string, params: CodeExampleParams): string {
    const {
      model,
      messages,
      maxTokens,
      temperature,
      stream,
      onlineSearch,
      location,
    } = params
  
    const bodyObject = {
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
      stream,
      extra_body: {
        online_search: onlineSearch,
        location,
      },
    }
  
    const bodyJson = JSON.stringify(bodyObject, null, 2)
  
    switch (language) {
      case 'javascript':
        return `fetch('https://api.two.ai/v2/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: ${bodyJson}
  })`
  
      case 'python':
        return `import requests
  
  url = "https://api.two.ai/v2/chat/completions"
  headers = {"Content-Type": "application/json"}
  data = ${bodyJson}
  
  response = requests.post(url, headers=headers, json=data)
  print(response.json())`
  
      case 'curl':
        const curlSafe = bodyJson.replace(/\\/g, '\\\\').replace(/'/g, `'\\''`)
        return `curl -X POST https://api.two.ai/v2/chat/completions \\
    -H "Content-Type: application/json" \\
    -d '${curlSafe}'`
  
      default:
        return '// Language not supported'
    }
  }
  