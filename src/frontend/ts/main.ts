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
        //alert(JSON.stringify(obj));

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
            
                          <button class="btn waves-effect waves-teal" id="edit_${disp.id}">Editar</button>
                          <button class="btn waves-effect waves-teal" id="delete_${disp.id}">Eliminar</button>
                         
                          <a href="#!" class="secondary-content">
                          <div class="switch"> <label>
                          Recorrido del dispositivo:  
                          <input type="number" id="ck_${disp.id}" min="0" max="1" step="0.1" value=${disp.state}>
                     
            
                          </label>
                        </div>
                          </a>
                        </li>`;
            
            ulDisp.innerHTML += item;
        }
        item= `<div class="col s12 m4 l8 xl6 center-align">
                    <button class="btn waves-effect waves-light button-view" id="btnAgregar">Agregar dispositivo</button>
                 </div>`;
        ulDisp.innerHTML += item;
        
        for (var disp of lista) {
            var checkPrender = document.getElementById("ck_" + disp.id);
            checkPrender.addEventListener("input", this);
            var checkDelete = document.getElementById("delete_" + disp.id);
            checkDelete.addEventListener("click", this);
            var checkEdit = document.getElementById("edit_" + disp.id);
            checkEdit.addEventListener("click", this.handleEdit(disp.id));
        }
        
    }
    obtenerDispositivo() {
        this.framework.ejecutarBackEnd("GET", "http://localhost:8000/devices",this);
    }

    handleEdit(id: number) {
        return () => {
          this.mostrarEdicion(id);
        };
      }

    mostrarEdicion(id: number): void {
        alert(id);
        // Obtener referencias a los elementos del pop-up
        const popupContainer = document.getElementById("popup");
        const editForm = document.getElementById("edit-form") as HTMLFormElement;
        const editNameInput = document.getElementById("edit-name") as HTMLInputElement;
        const editDescriptionInput = document.getElementById("edit-description") as HTMLInputElement;
        const cancelButton = document.getElementById("cancel-button");
        
        if (cancelButton) {
          cancelButton.addEventListener("click", () => {
            popupContainer.style.display = "none";
            console.log("Cancelado");
          });
        }
              
        editNameInput.value = "";
        editDescriptionInput.value = "";
      
        // Mostrar el pop-up
        popupContainer.style.display = "flex";
      
        // Escuchar el evento de envío del formulario
        editForm.addEventListener("submit", (event) => {
        event.preventDefault();
      
          // Obtener los valores ingresados por el usuario
          const nuevoNombre = editNameInput.value;
          const nuevaDescripcion = editDescriptionInput.value;
      
          // Actualizar los campos del dispositivo con los nuevos valores
          this.framework.ejecutarBackEnd("POST", "http://localhost:8000/edit", this, {id: id, name: nuevoNombre, description: nuevaDescripcion});
        
            // oculto pop-up
          popupContainer.style.display = "none";

          // Volver a listar los dispositivos para refrescar la vista
          this.obtenerDispositivo();
        });
    }

    handleEvent(event) {
        var elemento =<HTMLInputElement> event.target;
        console.log(elemento);
        console.log(elemento.id, elemento.value)
        if (event.target.id == "btnListar") {
            this.obtenerDispositivo();
            for (var user of this.users) {

                //TODO cambiar ESTO por mostrar estos datos separados por "-" 
                //en un parrafo "etiqueta de tipo <p>"

              
            }
        } else if (event.target.id == "btnLogin") {

            var iUser = <HTMLInputElement>document.getElementById("iUser");
            var iPass = <HTMLInputElement>document.getElementById("iPass");
            var username: string = iUser.value;
            var password: string = iPass.value;

            if (username.length > 3 && password.length>3) {
                
                //iriamos al servidor a consultar si el usuario y la cotraseña son correctas
                var parrafo = document.getElementById("parrafo");
                parrafo.innerHTML = "Espere...";
            } else {
                alert("el nombre de usuario es invalido");
            }

        } else if (elemento.id.startsWith("ck_")) {
            //Ir al backend y avisarle que el elemento cambio de estado
            //TODO armar un objeto json con la clave id y status y llamar al metodo ejecutarBackend
           
          //  alert("Cambiar el recorrido del dispositivo " + elemento.id);

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
            //generar un pop up o un pedazo de html debajo del boton
            //para que el usuario ingrese el nombre y la descripción del dispositivo
            //y luego llamar al backend para que lo agregue
            //armar un objeto json con la clave name, type y description y llamar al metodo ejecutarBackend
            alert("Agregar un nuevo dispositivo");

            // Realizar la solicitud POST con el id
            this.framework.ejecutarBackEnd("POST", "http://localhost:8000/agregar", this, {name: "Nuevo dispositivo", type: 1, description: "Nueva descripción"});
            // vuelve a listar los dispositivos
            this.obtenerDispositivo();


        } else if (elemento.id.startsWith("edit_")) {
            console.log("editando");

        } else {
            //TODO cambiar esto, recuperadon de un input de tipo text
            //el nombre  de usuario y el nombre de la persona
            // validando que no sean vacios
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




    var btnAgregar: HTMLElement = document.getElementById("btnAgregar");
    btnAgregar.addEventListener("click", main);

    var btnLogin = document.getElementById("btnLogin");
    btnLogin.addEventListener("click", main);

});
