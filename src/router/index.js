import Vue from 'vue';
import VueRouter from "vue-router";

Vue.use(VueRouter);


const routes=[
    {
        path:"/",
        name:"HelloWorld",
        component:()=>import(/* webpackChunkName: "helloWorld" */ "../components/HelloWorld.vue")
    },
    // {
    //     path:"/claimreward",
    //     name:"claim-reward",
    //     component:()=>
    //     import(
    //         /* webpackChunkName: "ClaimReward" */
    //         "../components/ClaimReward.vue"
    //     )
    // },
    ]
    const router = new VueRouter({
        mode:'history',
        routes
    })
export default router;