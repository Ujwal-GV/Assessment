document.addEventListener('DOMContentLoaded', function () {
    const productDataUrl = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448';

    fetch(productDataUrl)
        .then(response => response.json())
        .then(data => renderData(data.product));

    let selectedColor = null;
    let selectedSize = null;

    function renderData(product) {
        const mainImage = document.getElementById('main-image');
        const thumbnail1 = document.getElementById('thumbnail-1');
        const thumbnail2 = document.getElementById('thumbnail-2');
        const thumbnail3 = document.getElementById('thumbnail-3');
        const thumbnail4 = document.getElementById('thumbnail-4');

        thumbnail1.addEventListener('click', () => selectImg(thumbnail1, mainImage));

        thumbnail2.addEventListener('click', () => selectImg(thumbnail2, mainImage));

        thumbnail3.addEventListener('click', () => selectImg(thumbnail3, mainImage));

        thumbnail4.addEventListener('click', () => selectImg(thumbnail4, mainImage));

        document.getElementById('vendor').textContent = product.vendor;
        document.getElementById('product-name').textContent = product.title;
        document.getElementById('current-price').textContent = product.price + '.00';
        document.getElementById('original-price').textContent = product.compare_at_price + '.00';
        const discount = calculateDiscount(product.price, product.compare_at_price);
        document.getElementById('discount').textContent = `${discount}% Off`;

        const colorOptions = document.getElementById('color-options');
        product.options[0].values.forEach(colorObj => {
            const colorName = Object.keys(colorObj)[0];
            const colorCode = colorObj[colorName];

            const colorElement = document.createElement('div');
            colorElement.classList.add('color-option');
            colorElement.style.backgroundColor = colorCode;
            colorElement.addEventListener('click', () => selectColor(colorName, colorElement));
            colorOptions.appendChild(colorElement);
        });

        const sizeOptions = document.getElementById('size-options');
        product.options[1].values.forEach(size => {
            const sizeDiv = document.createElement('div');
            sizeDiv.classList.add('size-option');
            sizeOptions.appendChild(sizeDiv);
            const sizeElement = document.createElement('input');
            sizeElement.type = 'radio';
            sizeElement.name = 'size';
            sizeElement.value = size;
            sizeElement.id = `size-${size}`;
            sizeElement.addEventListener('change', () => selectedSize = size);
            sizeDiv.appendChild(sizeElement);
            const label = document.createElement('span');
            sizeDiv.classList.add('size-label');
            label.htmlFor = `size-${size}`;
            label.textContent = size;
            sizeDiv.appendChild(label);
        });

        document.getElementById('product-description').innerHTML = product.description;

        let quantity = 1;
        document.getElementById('increase-qty').addEventListener('click', () => {
            quantity++;
            document.getElementById('quantity').textContent = quantity;
        });

        document.getElementById('decrease-qty').addEventListener('click', () => {
            if (quantity > 1) quantity--;
            document.getElementById('quantity').textContent = quantity;
        });

        document.getElementById('add-to-cart').addEventListener('click', () => {
            const message = document.getElementById('msg');
            if (selectedColor && selectedSize) {
                message.classList.add('message');
                message.style.display = 'none';
                message.textContent = `${product.title} with Color ${selectedColor} and size ${selectedSize} with ${quantity} items added to cart`;
            } else {
                alert('Please select the color and size');
            }
            message.style.display = 'block';
            setTimeout(() => {
                message.textContent = '';
                message.style.display = 'none';
                quantity = 1;
                selectedColor = null;
                selectedSize = null;
                document.getElementById('quantity').textContent = 1;
                document.querySelectorAll('.color-option').forEach(elem => {
                    elem.classList.remove('selected');
                    elem.style.borderStyle = 'none';
                });
                document.querySelectorAll('input[name="size"]').forEach(elem => {
                    elem.checked = false;
                });
            }, 10000);
        });
    }

    function calculateDiscount(currentPrice, originalPrice) {
        const current = parseFloat(currentPrice.replace('$', ''));
        const original = parseFloat(originalPrice.replace('$', ''));
        return Math.round(((original - current) / original) * 100);
    }

    function selectColor(colorName, element) {
        selectedColor = colorName;
        document.querySelectorAll('.color-option').forEach(elem => {
            if(elem !==element){
                elem.classList.remove('selected');
                elem.style.border = 'none';
            }
        });
        element.style.border = '2px solid grey';
        element.style.borderStyle = 'ridge';
        element.classList.add('selected');
        }

    function selectImg(element, mainImage){
        document.querySelectorAll('.product-img').forEach(elem => {
            if(elem !== element){
                elem.style.border = 'none';
            }
            });
        element.style.border = '2px solid #3A4980';
        mainImage.src = element.src;
    }
});
