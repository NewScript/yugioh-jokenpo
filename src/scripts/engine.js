const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points')
    },
    cardsSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type')
    },
    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card')
    },
    playerSides: {
        player: 'player-cards',
        playerBox: document.querySelector('#computer-cards'),
        computer: 'computer-cards',
        computerBox: document.querySelector('#player-cards')
    },
    actions: {
        button: document.getElementById('next-duel')
    }
};

const pathImages = './src/assets/icons/';

const cardData = [
    {
        id: 0,
        name: 'Blue Eyes White Drafon',
        type: 'Paper',
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2]
    },
    {
        id: 1,
        name: 'Dark Magician',
        type: 'Rock',
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0]
    },
    {
        id: 2,
        name: 'Exodia',
        type: 'Scissors',
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1]
    }
]

const resetDuel = async () => {
    state.cardsSprites.avatar.src = '';
    state.actions.button.style.display = 'none';
    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';
    state.cardsSprites.name.innerText = 'Selecione';
    state.cardsSprites.type.innerText = 'um card';
    init();
};

async function playAudio( status ){
    try{
        const audio = new Audio( `./src/assets/audios/${status}.wav` );
        audio.play()
    }catch{}
}

const getRandomCardId = async () => {
    const randomIndex = Math.floor( Math.random() * cardData.length );
    return cardData[ randomIndex ].id;
}

const createCardImage = async ( idCard, fieldSide ) => {
    const cardImage = document.createElement( 'img' );
    cardImage.setAttribute( 'height', '100px' );
    cardImage.setAttribute( 'src', `${pathImages}card-back.png` );
    cardImage.setAttribute( 'data-id', idCard );
    cardImage.classList.add( 'card' );

    if( fieldSide === state.playerSides.player ){
        cardImage.addEventListener( 'click', () => {
            setCardsField( cardImage.getAttribute( 'data-id' ) );
        });
        cardImage.addEventListener( 'mouseover', () => {
            drawSelectCard( idCard );
        });
    };
    return cardImage;
}

const setCardsField = async ( cardId ) => {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = 'block';
    state.fieldCards.computer.style.display = 'block';

    state.fieldCards.player.src = cardData[ cardId ].img;
    state.fieldCards.computer.src = cardData[ computerCardId ].img;

    let duelResults = await checkDuelResults( cardId, computerCardId );

    await updateScore();

    await drawButton( duelResults )
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | 
                                        Lose : ${state.score.computerScore}`;
}

async function drawButton( text ){
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = 'block';
}

async function checkDuelResults( playerCardId, computerCardId ){

    let duelResults = 'Draw';    
    let playerCard = cardData[ playerCardId ];

    if( playerCard.winOf.includes( computerCardId )){
        duelResults = 'win';
        state.score.playerScore++;
    };
    
    if( playerCard.loseOf.includes( computerCardId )){
        duelResults = 'lose';
        state.score.computerScore++;
    };

    await playAudio( duelResults );

    return duelResults;    
}

async function removeAllCardsImages() {

    let { playerBox, computerBox } = state.playerSides;

    let imgElements = playerBox.querySelectorAll('img');
    imgElements.forEach( ( img ) => img.remove() );
    
    imgElements = computerBox.querySelectorAll('img');
    imgElements.forEach( ( img ) => img.remove() );
}

const drawSelectCard = async ( index ) => {
    state.cardsSprites.avatar.src = cardData[ index ].img;
    state.cardsSprites.name.innerText = cardData[ index ].name;
    state.cardsSprites.type.innerText = `Attribute: ${cardData[ index ].type}`;
};

const drawCards = async ( cardNumbers, fieldSide ) => {
    for( let i = 0; i < cardNumbers; i++ ){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage( randomIdCard, fieldSide );
        document.getElementById( fieldSide ).appendChild( cardImage );
    };
}

const init = () => {
    drawCards( 5, state.playerSides.player );
    drawCards( 5, state.playerSides.computer );

    const bgm = document.getElementById( 'bgm' );
    bgm.play()
};

state.actions.button.addEventListener( 'click', resetDuel );

init();