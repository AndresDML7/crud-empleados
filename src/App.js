import React, { useState, useEffect } from 'react'
import './App.css'
import { isEmpty } from 'lodash'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import { Modal, ModalBody, ModalHeader, ModalFooter  } from 'reactstrap'

function App() {

  const baseUrl = "https://localhost:44317/api/empleados"
  const [data, setData] = useState([])
  const [modalAgregar, setModalAgregar] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [modalDetalles, setModalDetalles] = useState(false)
  const [error, setError] = useState(null)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState({
    id: '',
    cedula: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    celular: '',
    email: '',
    direccion: ''
  })

  const handleChange = e => {
    const { name, value } = e.target
    setEmpleadoSeleccionado({
      ...empleadoSeleccionado, 
      [name]: value
    })
    console.log(empleadoSeleccionado)
  }

  const handleCreateModal = () => {
    setEmpleadoSeleccionado({
      id: '',
      cedula: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      celular: '',
      email: '',
      direccion: ''
    })
    setError(null)
    setModalAgregar(!modalAgregar)
  }

  const handleEditModal = () => {
    setModalEditar(!modalEditar)
  }

  const handleDetailModal = () => {
    setModalDetalles(!modalDetalles)
  }

  const handleDeleteModal = () => {
    setModalEliminar(!modalEliminar)
  }

  const peticionGet = async() => {
    await axios.get(baseUrl)
    .then(response => {
      setData(response.data)
    }).catch(error => {
      console.log(error)
    })
  }

  const peticionPost = async() => {
    if(!validForm()) {
      setError("Debes ingresar todos los datos.")
      return
    }

    delete empleadoSeleccionado.id
    empleadoSeleccionado.cedula = parseInt(empleadoSeleccionado.cedula)
    empleadoSeleccionado.telefono = parseInt(empleadoSeleccionado.telefono)
    empleadoSeleccionado.celular = parseInt(empleadoSeleccionado.celular)
    await axios.post(baseUrl, empleadoSeleccionado).then(response => {
      setData(data.concat(response.data))
      handleCreateModal()
    }).catch(error => {
      console.log(error)
    })
  }

  const peticionPut = async() => {
    empleadoSeleccionado.cedula = parseInt(empleadoSeleccionado.cedula)
    empleadoSeleccionado.telefono = parseInt(empleadoSeleccionado.telefono)
    empleadoSeleccionado.celular = parseInt(empleadoSeleccionado.celular)
    await axios.put(baseUrl+"/"+empleadoSeleccionado.id, empleadoSeleccionado).then(response => {
      var result = response.data
      var aux = data
      aux.map(empleado => {
        if(empleado.id === empleadoSeleccionado.id) {
          empleado.cedula = result.cedula
          empleado.nombres = result.nombres
          empleado.apellidos = result.apellidos
          empleado.telefono = result.telefono
          empleado.celular = result.celular
          empleado.email = result.email
          empleado.direccion = result.direccion
        }
      })
      handleEditModal()
    }).catch(error => {
      console.log(error)
    })
  }

  const peticionDelete = async() => {
    await axios.delete(baseUrl+"/"+empleadoSeleccionado.id).then(response => {
      setData(data.filter(empleado => (
        empleado.id !== response.data
      )))
      handleDeleteModal()
    }).catch(error => {
      console.log(error)
    })
  }

  const validForm = () => {
    setError(null)
    let isValid = true

    if(isEmpty(empleadoSeleccionado.cedula)) {
      isValid = false
    }

    if(isEmpty(empleadoSeleccionado.nombres)) {
      isValid = false
    }

    if(isEmpty(empleadoSeleccionado.apellidos)) {
      isValid = false
    }

    if(isEmpty(empleadoSeleccionado.telefono)) {
      isValid = false
    }

    if(isEmpty(empleadoSeleccionado.celular)) {
      isValid = false
    }

    if(isEmpty(empleadoSeleccionado.email)) {
      isValid = false
    }

    if(isEmpty(empleadoSeleccionado.direccion)) {
      isValid = false
    }

    return isValid;
  }

  const seleccionarEmpleado = (empleado, caso) => {
    setEmpleadoSeleccionado(empleado)

    if(caso === "Editar") {
      handleEditModal()
    } else if (caso === "Eliminar") {
      handleDeleteModal()
    } else {
      handleDetailModal()
    }
  }

  useEffect(() => {
    peticionGet()
  }, [])

  return (
    <div className="App container">
      <br/>
      <h2>Empleados</h2>
      <br/>
      <table className="table table-bordered" style={{ width: "80%", marginLeft: "auto", marginRight: "auto", border: 1, borderColor: "#a9a9a9"}} >
        <thead style={{ backgroundColor: "#d3d3d3"}}>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "#f5f5f5"}}>
          {
            data.map(empleado => (
              <tr key={empleado.id}>
                <td>{empleado.nombres}</td>
                <td style={{ width: "35%" }}>
                  <button className="btn btn-info btn-sm" onClick={() => seleccionarEmpleado(empleado, "Detalles")} >Detalles</button>{" "}
                  <button className="btn btn-warning btn-sm" onClick={() => seleccionarEmpleado(empleado, "Editar")} >Editar</button>{" "}
                  <button className="btn btn-danger btn-sm" onClick={() => seleccionarEmpleado(empleado, "Eliminar")} >Eliminar</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <br/>
      <button className="btn btn-success" style={{ float: "left", marginLeft: 110, marginBottom: 20 }} onClick={() => handleCreateModal()}>Añadir Nuevo Empleado</button>

      <Modal isOpen={modalAgregar}>
        <ModalHeader>Añadir Nuevo Empleado</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Cédula: </label>
            <br/>
            <input type="number" className="form-control" name="cedula" onChange={handleChange} />
            <br/>
            <label>Nombres: </label>
            <br/>
            <input type="text" className="form-control" name="nombres" onChange={handleChange} />
            <br/>
            <label>Apellidos: </label>
            <br/>
            <input type="text" className="form-control" name="apellidos" onChange={handleChange} />
            <br/>
            <label>Teléfono</label>
            <br/>
            <input type="number" className="form-control" name="telefono" onChange={handleChange} />
            <br/>
            <label>Celular: </label>
            <br/>
            <input type="text" className="form-control" name="celular" onChange={handleChange} maxLength={9} />
            <br/>
            <label>Email: </label>
            <br/>
            <input type="text" className="form-control" name="email" onChange={handleChange} />
            <br/>
            <label>Dirección: </label>
            <br/>
            <input type="text" className="form-control" name="direccion" onChange={handleChange} />
            <br/>
            <span style={{color: "red"}}>{error}</span>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={() => peticionPost()}>Añadir</button>
          <button className="btn btn-danger" onClick={() => handleCreateModal()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalDetalles}>
        <ModalHeader>Detalles Empleado</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Id: </label>
            <br/>
            <input type="number" className="form-control" name="cedula" readOnly value={empleadoSeleccionado && empleadoSeleccionado.id} />
            <br/>
            <label>Cédula: </label>
            <br/>
            <input type="number" className="form-control" name="cedula" readOnly onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.cedula} />
            <br/>
            <label>Nombres: </label>
            <br/>
            <input type="text" className="form-control" name="nombres" readOnly onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.nombres} />
            <br/>
            <label>Apellidos: </label>
            <br/>
            <input type="text" className="form-control" name="apellidos" readOnly onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.apellidos} />
            <br/>
            <label>Teléfono</label>
            <br/>
            <input type="number" className="form-control" name="telefono" readOnly onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.telefono} />
            <br/>
            <label>Celular: </label>
            <br/>
            <input type="text" className="form-control" name="celular" readOnly onChange={handleChange} maxLength={9} value={empleadoSeleccionado && empleadoSeleccionado.celular} />
            <br/>
            <label>Email: </label>
            <br/>
            <input type="text" className="form-control" name="email" readOnly onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.email} />
            <br/>
            <label>Dirección: </label>
            <br/>
            <input type="text" className="form-control" name="direccion" readOnly onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.direccion} />
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary" onClick={() => handleDetailModal()}>Cerrar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Empleado</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Id: </label>
            <br/>
            <input type="number" className="form-control" name="cedula" readOnly value={empleadoSeleccionado && empleadoSeleccionado.id} />
            <br/>
            <label>Cédula: </label>
            <br/>
            <input type="number" className="form-control" name="cedula" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.cedula} />
            <br/>
            <label>Nombres: </label>
            <br/>
            <input type="text" className="form-control" name="nombres" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.nombres} />
            <br/>
            <label>Apellidos: </label>
            <br/>
            <input type="text" className="form-control" name="apellidos" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.apellidos} />
            <br/>
            <label>Teléfono</label>
            <br/>
            <input type="number" className="form-control" name="telefono" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.telefono} />
            <br/>
            <label>Celular: </label>
            <br/>
            <input type="text" className="form-control" name="celular" onChange={handleChange} maxLength={9} value={empleadoSeleccionado && empleadoSeleccionado.celular} />
            <br/>
            <label>Email: </label>
            <br/>
            <input type="text" className="form-control" name="email" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.email} />
            <br/>
            <label>Dirección: </label>
            <br/>
            <input type="text" className="form-control" name="direccion" onChange={handleChange} value={empleadoSeleccionado && empleadoSeleccionado.direccion} />
            <br/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={() => peticionPut()}>Editar</button>
          <button className="btn btn-danger" onClick={() => handleEditModal()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen = {modalEliminar}>
        <ModalHeader>Eliminar Empleado</ModalHeader>
        <ModalBody>
          ¿Está seguro que desea eliminar el empleado { empleadoSeleccionado && empleadoSeleccionado.nombres }?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => peticionDelete()}>Sí</button>
          <button className="btn btn-secondary" onClick={() => handleDeleteModal()}>No</button>
        </ModalFooter>
      </Modal>

    </div>
  )
}

export default App
