const func = async () => {
    const response = await window.input.get_text()
    console.log(response) // 打印 'pong'
  }
  
  func()