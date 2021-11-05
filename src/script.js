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
        imgSrc: "img/unattended_car.jpg",
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
        imgSrc: "img/nosignal.jpg",
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
            You are not sure wether your car is safe to be left alone. 
            What will you do?
        `,
        imgSrc: "img/pic1.jpg",
        leadsTo: "B2",
        choices: [{
                text: "Turn of all the lights",
                correct: true,
                state: false,
                afterText: "Leaving your lights on may attract unwanted visitors. \n Wrong Choice."
            },
            {
                text: "Lock the car",
                correct: true,
                state: false,
                afterText: "Never leave a car unlocked, unless you want it to be stolen. \n Wrong Choice."
            },
            {
                text: "Set a fire next to the car",
                correct: false,
                afterText: "You wouldn't want to burn your car in these circumstances",
                state: false
            },
            {
                text: "Take some food with you",
                correct: false,
                afterText: "You don't need food ... it will not keep unwanted visitors away.",
                state: false
            }
        ]
    },
    "B2": {
        type: "singleChoice",
        text: `You find a nice cabin in the woods. There seems to be somebody inside the cabin.\n 
            What will you choose to do?
        `,
        imgSrc: "img/forestcabin.jpg",
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
        imgSrc: "img/walk_into_the_forest.jpg",
        leadsTo: "success",
        choices: [{
                text: "Call a tow truck",
                correct: true,
                state: false,
                afterText: "You need to get your car working again ... Can't stay here for to long..."
            },
            {
                text: "Call your family",
                correct: true,
                state: false,
                afterText: "You should really call your family..."
            },
            {
                text: "Play candy crush",
                correct: false,
                afterText: "Candy Crush? Really? ",
                state: false
            }
        ]
    },
    "X1": {
        type: "end",
        text: "You have done what no sane person would do. Say goodbye to this world ...",
    },
    "X2": {
        type: "end",
        text: "The lights go out and the doors open violently. An unknown man starts running towards. It is Game Over.",
    },
    "X3": {
        type: "end",
        text: "You wouldn't want to be in this forest of unknown entities ... Not a good choice. ",
    },
    "XX": {
        type: "end",
        text: "placeholder",
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
            storyLevels: levels,
            afterText: {},
            choiceState: false,
            volumeState: true,
            audioObj: new Audio("audio/main.mp3"),

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
        },
        evaluateMultipleChoice(choices, leadsTo) {
            let falseStatePresent = false
            for (choice of choices) {
                if (choice.state != choice.correct) {
                    falseStatePresent = true;

                    this.currentLevel = "XX";
                    this.storyLevels["XX"].text = choice.afterText;
                }
                choice.state = false;
            }

            if (!falseStatePresent) {
                this.currentLevel = leadsTo
            }
        },
        getCurrentAbsoluteURL() {
            return `${window.location.href}`;
        },
        rnd() {
            return Math.round(Math.random() * 3) + 1
        }
    },
    computed: {
        currentLevelData() {
            return this.storyLevels[this.currentLevel];
        }
    },
    watch: {
        currentLevel(newValue) {
            switch (newValue) {
                case "0":
                case "A1":
                case "A2":
                case "B1":
                case "B2":
                case "B3":
                    if (this.audioObj.src != `${this.getCurrentAbsoluteURL()}audio/main.mp3`) {
                        console.log("Not the same!")
                        this.audioObj.loop = true;
                        this.audioObj.src = "audio/main.mp3";
                        this.audioObj.play();
                    }
                    break;
                case 'X1':
                case 'X2':
                case 'X3':
                case 'XX':
                    this.audioObj.src = "audio/wrongchoice.mp3";
                    this.audioObj.play();
                    break;
                case 'success':
                    this.audioObj.loop = false;
                    this.audioObj.src = "audio/success.mp3";
                    this.audioObj.play();
                    break;
                default:
                    clearInterval(this.aloneTextTimelyInterval);
                    clearInterval(this.creepMovingInterval);
                    break;
            }

        },
        volumeState(newValue) {
            if (!newValue) {
                this.audioObj.muted = true;
            } else this.audioObj.muted = false;

        }
    },
    beforeMount() {
        this.deployAloneTextEffects();
    },
    mounted() {
        this.deployCreepyGuyMoving();
        this.audioObj.play();
    },
    beforeDestroy() {
        clearInterval(this.aloneTextTimelyInterval);
        clearInterval(this.creepMovingInterval);
    }
});