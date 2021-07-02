import React, { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { db } from '../src/firebase'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import './App.css';



function App() {

  const valoresIniciales = {
    nombre:'',
    url:'',
    descripcion:''
  }
  // variables de estado
  const [guardar, setGuardar]=useState(valoresIniciales)
  const [video, setVideo] = useState([])
  const [fakeId, setFakeId] = useState('')


  // funcion para guardar en una variables nuestros inputs
  const handleChange = (e)=>{
    const { name, value } = e.target 
    setGuardar({...guardar, [name]:value})
  }
  // funcion para escuchar el envio de datos 
  const onInputChange = (e)=>{
    e.preventDefault()
    // console.log(guardar);
    guardarVideo(guardar)
    setGuardar({...valoresIniciales})
  }
  // con esta funcion guardamos la informacion en la base de datos
  const guardarVideo = async (valor)=>{
    if(fakeId === ''){
      await db.collection('video').doc().set(valor)
      toast.success('🦄 el video fue agregado', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
    else{
      await db.collection('video').doc(fakeId).update(valor)
    }
    setFakeId('')
    
  }
  // funcion para eliminar el video
  const borrarVideo = async (id)=>{
    await db.collection('video').doc(id).delete()
    toast.warn('🦄 el video fue eliminado', {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }
  // evento para obtener los cambios dentro de la base de datos
  const getVideos = ()=>{
    db.collection('video').onSnapshot((querySnapshot)=>{
      const docs = []
      querySnapshot.forEach((doc)=>{
        docs.push({...doc.data(), id:doc.id})
      })
      setVideo(docs)
    })
  }
  // obtenemos un solo objeto de nuestra base de datos
  const getVid = async(id) =>{
    const doc = await db.collection('video').doc(id).get()
    setGuardar({...doc.data()})
  }
  // renderizacion
  useEffect(()=>{
    getVideos()
  }, [])

  // efecto para actualizar 

  useEffect(()=>{
    if (fakeId === ''){
      setGuardar({...valoresIniciales})
    }
    else{
      getVid(fakeId)
    }

  },[fakeId])
  return (
    <div className="">
      <h1 className="text-center mb-5 mt-5 text-white" >Mi lista de reproduccion favorita</h1>
       <div className="row">
        <div className="col-md-4">
          <h2 className="text-center text-white">formulario</h2>

          <div>
            <form className=" card-body" onSubmit={onInputChange} >
              <div className="form-group">
                <input type="text" placeholder="ingresar el titulo del video" className="form-control mb-4" name='nombre' onChange={handleChange} 
                value={guardar.nombre}  required />
              </div>

              <div className="form-group">
                <input type="text" placeholder="ingresar la url del video" className="form-control mb-4" name='url' onChange={handleChange} 
                value={guardar.url} required />
              </div>

              <div className="form-group">
                <textarea rows="4" placeholder="escribe la descripcion del video" className="form-control mb-4" name="descripcion" onChange={handleChange}
                value={guardar.descripcion} ></textarea>
              </div>

              <button className="btn btn-primary form-control">
                { fakeId === '' ? 'GUARDAR': 'ACTUALIZAR'}
              </button>

            </form>
          </div>
        </div>

        <div className="col-md-8">
        
          <h2 className="text-center text-white" >lista de videos</h2>

          <div>
            {video.map(videos => (
              <div className="card mb-1" key={videos.id} >
                <div className="card-body">
                {/* en esta seccion colocamos el titulo */}
                  <div className="d-flex justify-content-between" >
                    <h3>{videos.nombre}</h3>
                    <div>
                      <button className="btn btn-danger m-2" onClick={()=>borrarVideo(videos.id)} ><i class="fas fa-trash"></i></button>
                      <button className="btn btn-success" onClick={()=>setFakeId(videos.id)} ><i class="fas fa-pencil-alt"></i></button>
                    </div>
                  </div>

                {/* este contenedor es del reproductor de video */}
                  <div>
                    <ReactPlayer
                      url={videos.url}
                      width='100%'
                      height='650px'
                    />
                  </div>
                {/* en esta parte asignamos un titulo a nuestra descripcion */}
                  <h4 className='mt-2' >Descripcion del video</h4>
                  <p>{videos.descripcion}</p>


                </div>
              </div>
            ))}
          </div>

        </div>

       </div>

       <ToastContainer />
    </div>
  );
}

export default App;
