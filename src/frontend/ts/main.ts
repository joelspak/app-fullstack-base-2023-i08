var M;

class Main implements EventListenerObject,HttpResponse {
    users: Array<Usuario> = new Array();
    framework: Framework = new Framework();
   
    constructor() {
        var usr1 = new Usuario("mramos", "Matias");
        var usr2 = new Usuario("jlopez", "Juan");
        this.users.push(usr1);
        this.users.push(usr2);
        var obj = { "nombre": "Matias", "edad": 35, "masculino": true };
    }
    manejarRespueta(respueta: string) {
        var lista: Array<Device> = JSON.parse(respueta);
        var ulDisp = document.getElementById("listaDisp");
        ulDisp.innerHTML="";
        for (var disp of lista) {
            var item: string = `<li class="collection-item avatar">`;
                    if(disp.type==1){
                      item+=  '<img src="static/images/lightbulb.png" alt = "" class="circle" >'
                    } else {
                        item+=  '<img src="static/images/window.png" alt = "" class="circle" >'
                    }
                          
                        item+=`<span class="titulo">${disp.name}</span>
                        <p>
                        ${disp.description}
                        </p>
          
                        <button class="btn waves-effect waves-teal" id="edit_${disp.id}">
                            Editar
                            <i class="material-icons right">edit</i>
                        </button>
                        <button class="btn waves-effect waves-teal" id="delete_${disp.id}">
                            Eliminar
                            <i class="material-icons right">delete</i>
                        </button>
                        
                        <a href="#!" class="secondary-content">
                        <div class="switch"> <label>
                        Recorrido del dispositivo:  
                        <input type="range" id="ck_${disp.id}" min="0" max="1" step="0.1" value=${disp.state}>
                        </label>
                        </div>
                        </a>
                        </li>`;
            
            ulDisp.innerHTML += item;
        }
        item= `<div class="col s12 m4 l8 xl6 center-align">
                    <button class="btn waves-effect waves-light button-view" id="btnAgregar">
                        Agregar
                        <i class="material-icons right">add</i>
                    </button>
                    
                </div>`;
        ulDisp.innerHTML += item;
        
        for (var disp of lista) {
            var checkPrender = document.getElementById("ck_" + disp.id);
            checkPrender.addEventListener("input", this);
            var checkDelete = document.getElementById("delete_" + disp.id);
            checkDelete.addEventListener("click", this);
            var checkEdit = document.getElementById("edit_" + disp.id);
            checkEdit.addEventListener("click", this.handleEdit(disp.id, lista));
        }
        var checkAgregar = document.getElementById("btnAgregar");
        checkAgregar.addEventListener("click", this);   
    }

    obtenerDispositivo() {
        this.framework.ejecutarBackEnd("GET", "http://localhost:8000/devices",this);
    }

    handleEdit(id: number, lista: Array<Device>) {
        return () => {
          this.mostrarEdicion(id, lista);
        };
      }

    mostrarEdicion(id: number, lista: Array<Device>) {
      const popupContainer = document.getElementById("popup");
      const editForm = document.getElementById("edit-form");
      const editNameInput = document.getElementById("edit-name") as HTMLInputElement;
      const editDescriptionInput = document.getElementById("edit-description") as HTMLInputElement;
      const saveButton = document.getElementById("save-button");
      const cancelButton = document.getElementById("cancel-button");
    
      // Mostrar el pop-up
      popupContainer.style.display = "flex";
    
      // Obtener el dispositivo correspondiente al id
      const dispositivo = this.buscarDispositivoPorId(id, lista);
    
      if (cancelButton) {
      cancelButton.addEventListener("click", () => {
        popupContainer.style.display = "none";
        console.log("Cancelado");
        const dispositivo = null;
        });
      } 
    
      if (dispositivo) {
        // Establecer los valores iniciales en los campos del formulario
        editNameInput.value = dispositivo.name;
        editDescriptionInput.value = dispositivo.description;
    
        // Escuchar el evento click del botón save
        saveButton.addEventListener("click", () => {
        // Obtener los nuevos valores ingresados por el usuario
        const nuevoNombre = editNameInput.value;
        const nuevaDescripcion = editDescriptionInput.value;
  
        // Actualizar los campos del dispositivo con los nuevos valores
        dispositivo.name = nuevoNombre;
        dispositivo.description = nuevaDescripcion;
  
        // Enviar una solicitud POST para guardar los cambios en el servidor
        this.framework.ejecutarBackEnd("POST", "http://localhost:8000/edit/", this, {
          id: dispositivo.id,
          name: dispositivo.name,
          description: dispositivo.description
        });
  
        // ocultar pop up
        popupContainer.style.display = "none";

        // Realizar una solicitud GET para obtener los datos actualizados
        this.obtenerDispositivo();
        });
      }
    }  
      
    buscarDispositivoPorId(id: number, lista: Array<Device>): Device | undefined {
      // Buscar el dispositivo por su id
      return lista.find((dispositivo) => dispositivo.id === id);
    }
      
    handleEvent(event) {
        var elemento =<HTMLInputElement> event.target;
        console.log(elemento);
        console.log(elemento.id, elemento.value)
        if (event.target.id == "btnListar") {
            this.obtenerDispositivo();

        } else if (event.target.id == "btnLogin") {
            var iUser = <HTMLInputElement>document.getElementById("iUser");
            var iPass = <HTMLInputElement>document.getElementById("iPass");
            var username: string = iUser.value;
            var password: string = iPass.value;

            if (username.length > 3 && password.length>3) {
                //iriamos al servidor a consultar si el usuario y la cotraseña son correctas
                // agrego texto en el margen superior derecho que indique el usuario logueado
                var parrafo = document.getElementById("parrafo");
                parrafo.innerHTML = `<i class="material-icons left">account_circle</i>` + username;
                var btnListar = document.getElementById("btnListar");
                btnListar.style.display="block";
                var loginForm = document.getElementById("loginForm");
                loginForm.style.display="none";
            } else {
                alert("el nombre de usuario es invalido. Intente nuevamente.");
            };

        } else if (elemento.id.startsWith("ck_")) {
            //Ir al backend y avisarle que el elemento cambio de estado
            //Reemplazar elemento.id sacándole los primeros tres caracteres
            var id = elemento.id.replace("ck_", "");
            var newValue = elemento.value;                
            // Realizar la solicitud POST con el id y el nuevo valor
            this.framework.ejecutarBackEnd("POST", "http://localhost:8000/recorridos", this, {id: id, value: newValue});
        } else if (elemento.id.startsWith("delete_")) {
            //Ir al backend y avisarle que el elemento se debe eliminar
            //armar un objeto json con la clave id y llamar al metodo ejecutarBackend
            //Reemplazar elemento.id sacándole los primeros caracteres
            var id = elemento.id.replace("delete_", "");                     
            // Realizar la solicitud POST con el id
            this.framework.ejecutarBackEnd("POST", "http://localhost:8000/delete", this, {id: id});
            // vuelve a listar los dispositivos
            this.obtenerDispositivo();

        } else if (event.target.id == "btnAgregar") {
            //armar un objeto json con la clave name, type y description y llamar al metodo ejecutarBackend
            // Realizar la solicitud POST con el id
            // se agrega el dispositivo sin datos, para que el usuario lo edite
            this.framework.ejecutarBackEnd("POST", "http://localhost:8000/agregar", this, {name: "Nuevo dispositivo", type: 1, description: "Nueva descripción"});
            // vuelve a listar los dispositivos
            this.obtenerDispositivo();

        } else if (elemento.id.startsWith("edit_")) {
            console.log("editando");

        } else {
            console.log("yendo al back");
            this.framework.ejecutarBackEnd("POST", "http://localhost:8000/device", this, {});
           
        }
    }
}


window.addEventListener("load", () => {

    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems,{});
    var elemsC = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elemsC, {autoClose:true});

    var main: Main = new Main();
    var btnListar: HTMLElement = document.getElementById("btnListar");
    btnListar.addEventListener("click", main);

    var btnLogin = document.getElementById("btnLogin");
    btnLogin.addEventListener("click", main);

});