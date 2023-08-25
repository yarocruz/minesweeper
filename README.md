# Minesweeper

Followed this [YouTube Tut](https://www.youtube.com/watch?v=rxdGAKRndz8). 

It works, but there were ~~are~~ many code smells that I think could use some refactoring.

For example:

```js
for (let i = 0; i < squares.length; i++) {
      let total = 0
      const isLeftEdge = (i % width === 0)
      const isRightEdge = (i % width === width -1)

      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total ++
        if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total ++
        if (i > 10 && squares[i -width].classList.contains('bomb')) total ++
        if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++
        if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++
        if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++
        if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++
        if (i < 89 && squares[i +width].classList.contains('bomb')) total ++
        squares[i].setAttribute('data', total)
      }
}
```

It took me some time to understand that this is checking the 8 squares that sorround a square to count the bombs and place the numbers. But after careful study if found that all those number comparisons aren't necessary in the if's. 

This is my refactored code for that section:

```js
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
```

I still think that the way to go is with a 2D array for the squares so you don't have hard code the numbers for the top and bottom rows, nor for the left and right edge.

Right now I want to able to refactor it so the board can be bigger or any size really, at a timer, creating levels, but it's gonna get messy.
