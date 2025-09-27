
const apiUrl = 'http://localhost:3000/productos';

const productoForm = document.getElementById('productoForm');
const idProductoInput = document.getElementById('idProducto');
const codigoInput = document.getElementById('codigo');
const nombreInput = document.getElementById('nombre');
const categoriaInput = document.getElementById('categoria');
const precioInput = document.getElementById('precio');
const cantidadInput = document.getElementById('cantidad');
const tablaProductosBody = document.getElementById('tablaProductosBody');

let editandoId = null;

window.onload = () => {
  cargarProductos();
};

function cargarProductos() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      tablaProductosBody.innerHTML = '';
      data.forEach(p => {
        const tr = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = p.idProducto ?? '';
        tr.appendChild(tdId);

        const tdCodigo = document.createElement('td');
        tdCodigo.textContent = p.codigo ?? '';
        tr.appendChild(tdCodigo);

        const tdNombre = document.createElement('td');
        tdNombre.textContent = p.nombre ?? p.descripcion ?? '';
        tr.appendChild(tdNombre);

        const tdCategoria = document.createElement('td');
        tdCategoria.textContent = p.categoria ?? '';
        tr.appendChild(tdCategoria);

        const tdPrecio = document.createElement('td');
        tdPrecio.textContent = p.precio ?? 0;
        tr.appendChild(tdPrecio);

        const tdCantidad = document.createElement('td');
        tdCantidad.textContent = p.cantidad ?? 0;
        tr.appendChild(tdCantidad);

        const tdAcciones = document.createElement('td');

       
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => {
          comenzarEdicion(p);
        });
        tdAcciones.appendChild(btnEditar);

  
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => {
          if (confirm(`¿Eliminar producto ${p.nombre || p.descripcion}?`)) {
            eliminarProducto(p.idProducto);
          }
        });
        tdAcciones.appendChild(btnEliminar);

        tr.appendChild(tdAcciones);

        tablaProductosBody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error(err);
      alert('Error cargando productos. Revisa la consola.');
    });
}

productoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const idProducto = idProductoInput.value.trim();
  const codigo = codigoInput.value.trim();
  const nombre = nombreInput.value.trim();
  const categoria = categoriaInput.value.trim();
  const precio = precioInput.value.trim();
  const cantidad = cantidadInput.value.trim();

  if (!idProducto || (!nombre && !codigo)) {
    alert('Por favor completa al menos idProducto y nombre/código.');
    return;
  }

  const payload = {
    idProducto,
    codigo,
    nombre,
    categoria,
    precio: precio !== '' ? Number(precio) : 0,
    cantidad: cantidad !== '' ? Number(cantidad) : 0
  };

  if (!editandoId) {
    // POST
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json().catch(()=>({error: 'Error'}));
          throw new Error(err.error || 'Error creando producto');
        }
        return res.json();
      })
      .then(data => {
        limpiarFormulario();
        cargarProductos();
        alert('Producto creado correctamente.');
      })
      .catch(err => alert(err.message));
  } else {
    //PUT
    fetch(`${apiUrl}/${encodeURIComponent(editandoId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const err = await res.json().catch(()=>({error:'Error'}));
          throw new Error(err.error || 'Error actualizando producto');
        }
        return res.json();
      })
      .then(data => {
        limpiarFormulario();
        editandoId = null;
        cargarProductos();
        alert('Producto actualizado correctamente.');
      })
      .catch(err => alert(err.message));
  }
});
function comenzarEdicion(producto) {
  editandoId = producto.idProducto;
  idProductoInput.value = producto.idProducto ?? '';
  codigoInput.value = producto.codigo ?? '';
  nombreInput.value = producto.nombre ?? producto.descripcion ?? '';
  categoriaInput.value = producto.categoria ?? '';
  precioInput.value = producto.precio ?? '';
  cantidadInput.value = producto.cantidad ?? '';
  
}


function eliminarProducto(id) {
  fetch(`${apiUrl}/${encodeURIComponent(id)}`, { method: 'DELETE' })
    .then(async res => {
      if (!res.ok) {
        const err = await res.json().catch(()=>({error:'Error'}));
        throw new Error(err.error || 'Error eliminando producto');
      }
      return res.json();
    })
    .then(data => {
      cargarProductos();
      alert('Producto eliminado.');
    })
    .catch(err => alert(err.message));
}

function limpiarFormulario() {
  idProductoInput.value = '';
  codigoInput.value = '';
  nombreInput.value = '';
  categoriaInput.value = '';
  precioInput.value = '';
  cantidadInput.value = '';
  editandoId = null;
}
