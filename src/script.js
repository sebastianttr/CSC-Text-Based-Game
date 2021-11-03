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


const levels = {
    "A1": {
        type: "singleChoice",
        text: `Your check engine light has come on and the car slowly loses power. 
        You stop at the side of the road and check the engine, only to see smoke coming out. 
        But you cannot risk being in the forest. \n
        \n
        What will you do?`,
        imgSrc: "img/pic1.jpg",
        choices: [{
                text: "Use your phone to call for help",
                leadsTo: "A2"
            },
            {
                text: "Walk around and look for a house",
                leadsTo: "B1"
            },
            {
                text: "Wait for passerby",
                leadsTo: "X3"
            }
        ]
    },
    "A2": {
        type: "singleChoice",
        text: `
            You cannot make phone calls because there is no signal.\n
            What else could you do?
        `,
        imgSrc: "",
        choices: [{
                text: "Just out of curiosity, walk into the forest",
                leadsTo: "X1"
            },
            {
                text: "Walk around and look for a house",
                leadsTo: "B1"
            },
            {
                text: "Wait for passerby",
                leadsTo: "X3"
            }
        ]
    },
    "B1": {
        type: "multipleChoice",
        text: `
            Your are not sure wether your car is safe to be left alone.\n
            What will you do?
        `,
        imgSrc: "",
        choices: [{
                text: "Turn of all the lights",
                correct: true
            },
            {
                text: "Lock the car",
                correct: true
            },
            {
                text: "Set a fire next to the car",
                correct: false,
                afterText: "You would't want to burn your car in these circumstances",
            },
            {
                text: "Take some food with you",
                correct: false,
                afterText: "You don't need food ... it will not keep your car away from monsters"
            }
        ]
    },
    "B2": {
        type: "singleChoice",
        text: `You see a nice cabin in the woods. There seems to be somebody inside the cabin.\n 
            What will you choose to do?
        `,
        imgSrc: "",
        choices: [{
                text: "Knock on the door",
                leadsTo: "X2"
            },
            {
                text: "Keep walking",
                leadsTo: "B3"
            }
        ]
    },
    "B3": {
        type: "multipleChoice",
        text: `
        You finally have a signal. What are the things you should do?
        `,
        imgSrc: "",
        choices: [{
                text: "Call a tow truck",
                correct: true
            },
            {
                text: "Call your family",
                correct: true
            },
            {
                text: "Play candy crush",
                correct: false,
                afterText: "Candy Crush? Really? ",
            }
        ]
    },
    "X1": {
        type: "end",
        text: "You have done what no sane person would do. Say goodbye to this world ...",
        imgSrc: "",
    },
    "X2": {
        type: "end",
        text: "The lights go out and the doors open violently. An unknown man starts running towards. You are done. ",
        imgSrc: "",
    },
    "X3": {
        type: "end",
        text: "Your family will be very worried. Not a good choice. ",
        imgSrc: "",
    }
}


const app = new Vue({
    el: "#app",
    data() {
        return {
            currentLevel: "0",
            aloneText: "",
            aloneTextOpacity: 0,
            aloneTextTimelyInterval: null,
            creepMovingInterval: null,
            storyLevels: levels
        };
    },
    methods: {
        startGame() {
            this.currentLevel = "intermission";
        },
        setLevel(lvl) {
            this.currentLevel = lvl;
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
                let index = Math.round(Math.random() * 3)

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
    computed: {
        currentLevelData() {
            return this.storyLevels[this.currentLevel];
        }
    },
    watch: {
        currentLevel(newValue) {
            if (newValue != "0") {
                clearInterval(this.aloneTextTimelyInterval);
                clearInterval(this.creepMovingInterval);
            }
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