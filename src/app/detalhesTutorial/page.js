export default function DetalhesTutorial() {
  return (
    <div 
    class="border-1 border-verde-musgo  flex justify-center items-center flex-col  w-full gap-4 " 
     style={{ 
        width: '900px', 
        height: '629px', 
        backgroundColor: '#f0f0f0' 
      }}
    >
        <h1 className='text-verde-musgo me-56 font-bold text-4xl'>BRAÇO ROBÓTICO DE PAPELÃO</h1>
         <video className="ms-4" width="800px" height="441px" controls>
          <source src="/video-exemplo.mp4" type="video/mp4" />
            Seu navegador não suporta a tag de vídeo.
        </video>
        <p className="text-verde-musgo text-1xl ">Assista ao guia completo para a montagem e programação do Braço Robótico de Papelão.</p>

    </div>
  )
}
