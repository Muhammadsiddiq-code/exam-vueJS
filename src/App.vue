<!-- <template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import './assets/styles/main.css';
</style> -->



<script>
import { getSalom } from './api/salom'

export default {
  name: 'App',
  mounted() {
    getSalom().then(data => {
      console.log(data.xabar) // Backenddan salom!
    })
  }
}
</script>
