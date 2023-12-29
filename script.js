document.addEventListener('DOMContentLoaded', function () {
    const preview = document.getElementById('imagePreview');
const input = document.getElementById('imageInput');

function imagePreview() {
if (input.files && input.files[0]) {
const reader = new FileReader(); 

reader.onload = function (e) {
    preview.src = e.target.result;
};

reader.readAsDataURL(input.files[0]); 
}
}
input.addEventListener('change', imagePreview);
});



const form = document.getElementById('form');
            const product = document.getElementById('product_name');
            const productError = document.getElementById('productError');
            const description = document.getElementById('description');
            const descriptionError = document.getElementById('descriptionError');
            const saleprice = document.getElementById('saleprice');
            const salepriceError = document.getElementById('salepriceError');
            const regularprice = document.getElementById('regularprice');
            const regularpriceError = document.getElementById('regularpriceError');
            const ifsmallpriceError = document.getElementById('ifsmallpriceError');
            const small = document.getElementById("product_name1");
            const smallError = document.getElementById("smallError")
            const medium = document.getElementById("product_name2");
            const mediumError = document.getElementById("mediumError")
            const large = document.getElementById("product_name3");
            const largeError = document.getElementById("largeError")
            const submitError = document.getElementById("submitError")
            const button = document.getElementById('btn')
        
            function validateProduct() {
                const productpattern = /^[a-zA-Z][a-zA-Z ]*$/;
                if (productpattern.test(product.value)) {
                    productError.innerHTML = '';
                } else {
                    productError.innerHTML = 'Must contain only letters';
                    productError.style.display = 'block';
                    setTimeout(() => {
                        productError.style.display = 'none';
                    }, 3000);
                }
            }
        
            function validateDescription() {
                const descriptionpattern = /^[^\s][\s\S]*$/;
                if (descriptionpattern.test(description.value)) {
                    descriptionError.innerHTML = '';
                } else {
                    descriptionError.innerHTML = 'Invalid input';
                    descriptionError.style.display = 'block';
                    setTimeout(() => {
                        descriptionError.style.display = 'none';
                    }, 3000);
                }
            }
        
            function validatesaleSalePrice() {
                const salepricepattern = /^(?!-)\d+$/;
                if(saleprice.value.trim()===''){
                    salepriceError.innerHTML="price field cant be empty"
                }
                if (salepricepattern.test(saleprice.value)) {
                    salepriceError.innerHTML = '';
                } else {
                    salepriceError.innerHTML = 'Invalid input';
                    salepriceError.style.display = 'block';
                    setTimeout(() => {
                        salepriceError.style.display = 'none';
                    }, 3000);
                }
            }
        
            function validateRegularPrice() {
                const regularpricepattern = /^(?!-)\d+$/;
                if(regularprice.value.trim()===''){
                    regularpriceError.innerHTML="price field cant be empty"
                }
                if (regularpricepattern.test(regularprice.value)) {
                    regularpriceError.innerHTML = '';
                } else {
                    regularpriceError.innerHTML = 'Invalid input';
                    regularpriceError.style.display = 'block';
                    setTimeout(() => {
                        regularpriceError.style.display = 'none';
                    }, 3000);
                }
            }
        
            function validateSmallQuantity() {
           const smallpattern = /^\d+(\.\d+)?$/
           if(small.value.trim()===''){
            smallError.innerHTML="quantity field cant be empty"
           }
               if(smallpattern.test(small.value)){
                smallError.innerHTML=''
               }else{
                smallError.innerHTML = 'Invalid input';
                    smallError.style.display = 'block';
                    setTimeout(() => {
                        smallError.style.display = 'none';
                    }, 3000);
               }
        }
        function mediumQuantity() {
            if(medium.value.trim()===''){
                mediumError.innerHTML="field cant be empty"
            }
           const mediumpattern = /^\d+(\.\d+)?$/
               if(mediumpattern.test(medium.value)){
                mediumError.innerHTML=''
               }else{
                mediumError.innerHTML = 'Invalid input';
                    mediumError.style.display = 'block';
                    setTimeout(() => {
                        mediumError.style.display = 'none';
                    }, 3000);
               }
        }
        function largeQuantity() {
           const largepattern = /^\d+(\.\d+)?$/
           if(large.value.trim()===''){
            largeError.innerHTML="quantity field cant be empty"
           }
               if(largepattern.test(large.value)){
                largeError.innerHTML=''
               }else{
                largeError.innerHTML = 'Invalid input';
                    largeError.style.display = 'block';
                    setTimeout(() => {
                        largeError.style.display = 'none';
                    }, 3000);
               }
        }
        function ifsmall(){
            if(saleprice.value>regularprice.value){
                regularpriceError.innerHTML='regular price must be higher than saleprice'
                regularpriceError.style.display='block';
            }else{
                regularpriceError.innerHTML=''
            }
        }
        form.addEventListener('submit', function(event){
                validateProduct();
                validateDescription();
                validatesaleSalePrice();
                validateRegularPrice();
                ifSmall();
                validateSmallQuantity();
                mediumQuantity();
                largeQuantity();
                ifsmall();
    
        
                if (productError.innerHTML || descriptionError.innerHTML || salepriceError.innerHTML || regularpriceError.innerHTML || ifsmallpriceError.innerHTML||small.innerHTML||mediumError.innerHTML||largeError.innerHTML) {
                    event.preventDefault();
                  
                    setTimeout(() => {
                window.location.href = '/admin/addproduct';
            }, 200);
                }
            });
        
            product.addEventListener('blur', validateProduct);
            description.addEventListener('blur', validateDescription);
            saleprice.addEventListener('blur', validatesaleSalePrice);
            regularprice.addEventListener('blur', validateRegularPrice);
            small.addEventListener('blur',validateSmallQuantity)
            medium.addEventListener('blur',mediumQuantity)
            large.addEventListener('blur',largeQuantity)
