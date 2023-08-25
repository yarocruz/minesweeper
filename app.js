document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    //const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    const btn = document.querySelector('button')
    const countdown = document.querySelector('.countdown')

    let width = 10
    let bombAmount = 20
    let flags = 0
    let squares = []
    let isGameOver = false
    let timeLeft = 10

    btn.addEventListener('click', startTimer)

    function startTimer() {
        let interval = setInterval(() => {
            timeLeft--
            countdown.innerHTML = timeLeft
            if (timeLeft === 0) {
                isGameOver = true;
                clearInterval(interval)
                result.innerHTML = 'You Ran out of Time! Game Over!'
            }
        }, 1000)
    }

    //create Board
    function createBoard() {
        //flagsLeft.innerHTML = bombAmount

        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = shuffleArray(gameArray)

        // this loop creates 100 square divs
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            //normal click
            square.addEventListener('click', function (e) {
                click(square)
            })

            //cntrl and left click
            square.oncontextmenu = function (e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        // this loop counts the bombs
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0) // if divives evenly 0, 10, 20, 30...
            const isRightEdge = (i % width === width - 1) // if the remainder is 9 eg 9, 19, 29, 39...
            const topRow = i < 10
            const bottomRow = i > 89

            if (squares[i].classList.contains('valid')) {
                if (!isLeftEdge && squareIsBomb(squares[i - 1])) total++ // check to the left
                if (!isRightEdge && squareIsBomb(squares[i + 1])) total++ // check to the right

                if (!topRow && !isRightEdge && squareIsBomb(squares[i + 1 - width])) total++ // check top right
                if (!topRow && squareIsBomb(squares[i - width])) total++ // check top
                if (!topRow && !isLeftEdge && squareIsBomb(squares[i - 1 - width])) total++ // check top left

                if (!bottomRow && !isLeftEdge && squareIsBomb(squares[i - 1 + width])) total++ // check bottom left
                if (!bottomRow && !isRightEdge && squareIsBomb(squares[i + 1 + width])) total++ // check bottom right
                if (!bottomRow && squareIsBomb(squares[i + width])) total++ // check bottom

                // on the div set data attrible that will equal the total
                squares[i].setAttribute('data', total)
            }
        }
    }
    createBoard()

    // helper fn to check for bombs
    function squareIsBomb(square) {
        return square.classList.contains('bomb')
    }

    // optimized shuffling of array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    //add Flag with right click
    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = ' 🚩'
                flags++
                //flagsLeft.innerHTML = bombAmount - flags
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
                //flagsLeft.innerHTML = bombAmount - flags
            }
        }
    }

    //click on square actions
    function click(square) {
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            gameOver(square)
        } else {
            let total = parseInt(square.getAttribute('data'))
            if (total !== 0) {
                square.classList.add('checked')
                if (total === 1) square.classList.add('one')
                if (total === 2) square.classList.add('two')
                if (total === 3) square.classList.add('three')
                if (total === 4) square.classList.add('four')
                if (total === 5) square.classList.add('five')
                if (total === 6) square.classList.add('six')
                if (total === 7) square.classList.add('seven')
                if (total === 8) square.classList.add('eight')
                square.innerHTML = total
                return
            }
            checkSquare(square, currentId)
        }
        square.classList.add('checked')
    }


    //check neighboring squares once square is clicked
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)
        const topRow = currentId < 10
        const bottomRow = currentId > 89

        setTimeout(() => {
            if (!isLeftEdge) {
                const newId = parseInt(currentId) - 1 // left
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (!topRow && !isRightEdge) {
                const newId = parseInt(currentId) + 1 - width // top right
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (!topRow) {
                const newId = parseInt(currentId) - width // top
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (!topRow && !isLeftEdge) {
                const newId = parseInt(currentId) - 1 - width // top-left
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (!isRightEdge) {
                const newId = parseInt(currentId) + 1  // right
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (!bottomRow && !isLeftEdge) {
                const newId = parseInt(currentId) - 1 + width // bottom left
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (!bottomRow && !isRightEdge) {
                const newId = parseInt(currentId) + 1 + width // bottom right
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (!bottomRow) {
                const newId = parseInt(currentId) + width // bottom
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
        }, 10)
    }

    //game over
    function gameOver(square) {
        result.innerHTML = 'BOOM! Game Over!'
        isGameOver = true

        //show ALL the bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
                square.classList.remove('bomb')
                square.classList.add('checked')
            }
        })
    }

    //check for win
    function checkForWin() {
        ///simplified win argument
        let matches = 0

        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++
            }
            if (matches === bombAmount) {
                result.innerHTML = 'YOU WIN!'
                isGameOver = true
            }
        }
    }
})