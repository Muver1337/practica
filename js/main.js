let eventBus = new Vue()

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
        }
    },
    template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
})




Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
     <div class="product">
          
        <div class="product-image">
          <img :src="image" />
        </div>
  
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
            <a v-bind:href="link">More products like this</a>
            <p v-if="inStock">In Stock</p>
            <p v-else>Out of Stock</p>
            <span v-show="onSale">On Sale</span>
            <p>Shipping: {{ shipping }}</p>
  
            <product-details></product-details>
  
            <div class="color-box"
                 v-for="(variant, index) in variants" 
                 :key="variant.variantId"
                 :style="{ backgroundColor: variant.variantColor }"
                 @mouseover="updateProduct(index)"
                 >
            </div>
            
            <ul>
                <li v-for="size in sizes">{{ size }}</li>
            </ul> 
  
            <button v-on:click="addToCart" 
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }"
              >
            Add to cart
            </button>
            <button v-on:click="remToCart" 
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }"
              >Rem to Cart
            </button>
  
         </div> 

         <product-tabs :reviews="reviews"></product-tabs>
      
      </div>
     `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],

            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
            reviews:[]
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        remToCart() {
            this.$emit('rem-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        }
    },
    computed: {
        title() {
            if (this.variants[this.selectedVariant].onSale) {
                return this.brand + ' ' + this.product;
            } else {
                return this.brand + ' ' + this.product;
            }
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})






Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    template: `
      <div>
      
        <div>
          <span class="tab" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="selectedTab = tab"
          >{{ tab }}</span>
        </div>

        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul v-else>
                <li v-for="review in reviews">
                  <p>Name: {{ review.name }}</p>
                  <p>Rating: {{ review.rating }}</p>
                  <p>Answer: {{ review.answer }}</p>
                  <p>Review: {{ review.review }}</p>
                </li>
            </ul>
        </div>

        <div v-show="selectedTab === 'Make a Review'">
          <product-review></product-review>
        </div>        
    </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'  // устанавливается с помощью @click
        }
    }
})





Vue.component('product-review', {
    template: `
   <form class="review-form" @submit.prevent="onSubmit">
   <p v-if="errors.length">
 <b>Please correct the following error(s):</b>
 <ul>
   <li v-for="error in errors">{{ error }}</li>
 </ul>
</p>
<legend>Отзыв</legend>
 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="Name">
 </p>

 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
 </p>
 
 <p>«Would you recommend this product?».</p>
 <div class="p">
    <label for="positive">Yes</label>    
       <input v-model="answer" type="radio" id="positive" name="answer" value="Да">
       <label for="positive">No</label>
       <input v-model="answer" type="radio" id="negative" name="answer" value="Нет">
   <br>
</div>

 <p>
   <label for="rating">Rating:</label>
   <select id="rating" v-model.number="rating">
     <option>5</option>
     <option>4</option>
     <option>3</option>
     <option>2</option>
     <option>1</option>
   </select>
 </p>

 <p>
   <input type="submit" value="Submit" v-on:click="removeMass"> 
 </p>

</form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            answer: null,
            errors: []
        }
    },

    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    answer: this.answer

                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.answer = null
            } else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
                if (!this.answer) this.errors.push("You would recommend or not?!")
            }
        },
        removeMass() {
            this.errors.length = 0
        }
    }
})

// Vue.component('redColor', {
//     props: {
//         details: {
//             type: Array,
//             required: true
//         }
//     },
//     template: `
//      <li v-for="review in reviews">
//         <p>Name: {{ review.name }}</p>
//         <p>Rating: {{ review.rating }}</p>
//         <p>Answer: {{ review.answer }}</p>
//         <p>Review: {{ review.review }}</p>
//      </li>
//   `,
//     computed: {
//
//     }
// })





let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
        reviews: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        remToCart(id) {
            this.cart.pop(id);
        },
    }
})
