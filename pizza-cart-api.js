document.addEventListener('alpine:init', () => {
  Alpine.data('pizzaCartWithAPIWidget', function () {
    return {

      init() {
        axios
          .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
          .then((result) => {
            // console.log(result.data);
            this.pizzas = result.data.pizzas

          })
          .then(() => {
            return this.createCart();
            

          })
          .then((result) => {
           // console.log(result.data);
            this.cartId = result.data.cart_code;
          });
      },

      
      createCart() {
        return axios
        .get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
      },

      showCart(){
        const url = `http://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;

        axios
        .get(url)
        .then((result)=>{
          this.cart = result.data;
        });
      },
      
      pizzaImage(pizza) {
        return `./img/${pizza.size}.png`
      },
      
      message: 'Eating pizzas',
      username: 'mary',
      pizzas: [],
      cartId: '',
      cart: {total:0},
      payNow: false,
      paymentAmount: 0,
      paymentMessage: '',


      add(pizza) {
        const params = {
          cart_code: this.cartId,
          pizza_id: pizza.id
        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
          .then(() =>{
           this.message = "pizza added to the cart"
           this.showCart();
          })
          .catch(err => alert(err));
       // alert(pizza.id)
      },

      remove(pizza){
        // /api/pizza-cart/remove
        const params = {
          cart_code : this.cartId,
          pizza_id : pizza.id
        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
          .then(()=>{
            this.message= "pizza removed from the cart"
            this.showCart();
          })
          .catch(err=>alert(err));

      },

      pay(pizza){
        const params = {
          cart_code : this.cartId,
        }
        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
          .then(()=>{
              if(!this.paymentAmount){
                  this.paymentMessage = 'No amount entered!'
              }
              else if(this.paymentAmount >= this.cart.total.toFixed(2)){
                  this.paymentMessage = 'Payment Sucessful!'
                  this.message= this.username  +" Paid!"
                  setTimeout(() => {
                      this.cart.total = ''
                  }, 3000);
              }else{
                  this.paymentMessage = 'Sorry - that is not enough money!'
                  setTimeout(() => {
                      this.cart.total = ''
                  }, 3000);
              }
          })
          .catch(err=>alert(err));
      },




    }
  })
})