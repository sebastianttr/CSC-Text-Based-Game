function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

const creepPositions = [{
        marginTop: "390px",
        marginLeft: "800px",
        scale: "0.3"
    },
    {
        marginTop: "390px",
        marginLeft: "1200px",
        scale: "0.8"
    },
    {
        marginTop: "380px",
        marginLeft: "540px",
        scale: "0.6"
    },
    {
        marginTop: "400px",
        marginLeft: "900px",
        scale: "0.2"
    },
]


const app = new Vue({
    el: "#app",
    data() {
        return {
            currentLevel: "0",
            aloneText: "",
            aloneTextOpacity: 0,
            aloneTextTimelyInterval: null,
            creepMovingInterval: null,
        };
    },
    methods: {
        setConsoleOutput() {
            console.log("Start the game.")
        },
        async deployAloneTextEffects() {
            await delay(500);

            console.log("Running effect.")
            for (let i = 0; i < 100; i++) {
                let currentRandom = Math.round(Math.random());
                this.aloneTextOpacity = i

                this.aloneText = (currentRandom == 1) ? "alone" : "";
                await delay(10);
            }

            this.aloneText = "alone"

            this.startTimelyAloneTextDisapperance();
        },
        startTimelyAloneTextDisapperance() {
            this.aloneTextTimelyInterval = setInterval(async() => {
                for (let i = 0; i < 50; i++) {
                    let currentRandom = Math.round(Math.random());
                    this.aloneText = (currentRandom == 1) ? "alone" : "";
                    await delay(10);
                }

                this.aloneText = "alone"
            }, 15000);
        },
        deployCreepyGuyMoving() {
            let el = document.querySelector(".creepyFigure");

            this.creepMovingInterval = setInterval(() => {
                let visibile = Boolean(Math.round(Math.random()));
                let index = Math.round(Math.random() * 4)

                if (visibile) {
                    el.style.visibility = "visible";
                    el.style.marginTop = creepPositions[index].marginTop;
                    el.style.marginLeft = creepPositions[index].marginLeft;
                    el.style.scale = creepPositions[index].scale;
                } else {
                    el.style.visibility = "hidden";
                }
            }, 5000);
        }
    },
    beforeMount() {
        this.deployAloneTextEffects();
    },
    mounted() {
        this.deployCreepyGuyMoving();
    },
    beforeDestroy() {
        clearInterval(this.aloneTextTimelyInterval);
        clearInterval(this.creepMovingInterval);
    }
});