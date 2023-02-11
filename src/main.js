import { createApp } from 'vue'
import App from './components/app/App.vue'
import uiComponents from './ui-components'
import "./index.css"

const app = createApp(App) //App dasturimizni nusxalab beradi

uiComponents.map(component => { // massivni map qilib global elon qilish
  app.component(component.name, component) // (nameString-yani componentimiz nomi beriladi, component)
})

app.mount('#app')
