let cart = [];
let modalQuant = 1;
let modalChave = 0;

const chamar = (elemento)=> {
    return document.querySelector(elemento);
}
const chamaArray = (elemento)=> {
    return document.querySelectorAll(elemento);
}

// Listagem das pizzas
pizzaJson.map( (item, index)=>{
    let pizzaItem = chamar('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQuant = 1;
        modalChave = key;

        chamar('.pizzaBig img').src = pizzaJson[key].img;
        chamar('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        chamar('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        chamar('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        chamar('.pizzaInfo--size.selected').classList.remove('selected');
        chamaArray('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        chamar('.pizzaInfo--qt').innerHTML = modalQuant;

        chamar('.pizzaWindowArea').style.opacity = 0;
        chamar('.pizzaWindowArea').style.display = 'flex';
        setTimeout( ()=>{
            chamar('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    })

    chamar('.pizza-area').append(pizzaItem);
});

// Eventos do MODAL
function fechaModal() {
    chamar('.pizzaWindowArea').style.opacity = 0;
    setTimeout( ()=>{
        chamar('.pizzaWindowArea').style.display = 'none';
    }, 500);

}
chamaArray('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', fechaModal); 
});

chamar('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQuant > 1) {
        modalQuant--;
        chamar('.pizzaInfo--qt').innerHTML = modalQuant;
    }
});
chamar('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQuant++;
    chamar('.pizzaInfo--qt').innerHTML = modalQuant;
});
chamaArray('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        chamar('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
chamar('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = chamar('.pizzaInfo--size.selected').getAttribute('data-key');
    let identification = pizzaJson[modalChave].id+'@'+size;
    let chave = cart.findIndex((item)=>item.identification == identification);
    if(chave > -1) {
        cart[chave].quant += modalQuant;
    } else {
        cart.push({
            identification,
            id:pizzaJson[modalChave].id,
            size,
            quant:modalQuant
        });
    }
    updateCart();
    fechaModal();
});
// Atualização do carrinho

chamar('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0) {
        chamar('aside').style.left = '0';
    }
});
chamar('.menu-closer').addEventListener('click', ()=>{
    chamar('aside').style.left = '100vw';
});


function updateCart() {
    chamar('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        chamar('aside').classList.add('show');
        chamar('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].quant;

            let cartItem = chamar('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case '0':
                    pizzaSizeName = 'P';
                    break;
                case '1':
                    pizzaSizeName = 'M';
                    break;
                case '2':
                    pizzaSizeName = 'G';
                    break;

                default:
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].quant;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].quant > 1) {
                    cart[i].quant--;
                } else {
                    cart.splice(i, 1);       
                }
                updateCart();
                
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].quant++;
                updateCart();
            });

            chamar('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        chamar('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        chamar('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        chamar('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        chamar('aside').classList.remove('show');
        chamar('aside').style.left = '100vw';
    }
}