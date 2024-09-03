const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Helper functions
function positionToCoordinates(pos) {
    const file = pos[0].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
    const rank = parseInt(pos[1], 10) - 1;
    return [rank, file];
}

function coordinatesToPosition(coords) {
    const file = String.fromCharCode(coords[1] + 'A'.charCodeAt(0));
    const rank = (coords[0] + 1).toString();
    return file + rank;
}

function getKnightMoves(currentPos) {
    const [rank, file] = positionToCoordinates(currentPos);
    const moves = [
        [rank + 2, file + 1], [rank + 2, file - 1],
        [rank - 2, file + 1], [rank - 2, file - 1],
        [rank + 1, file + 2], [rank + 1, file - 2],
        [rank - 1, file + 2], [rank - 1, file - 2],
    ];
    return filterValidMoves(moves);
}

function getRookMoves(currentPos) {
    const [rank, file] = positionToCoordinates(currentPos);
    const moves = [];
    for (let i = 0; i < 8; i++) {
        if (i !== rank) moves.push([i, file]);
        if (i !== file) moves.push([rank, i]);
    }
    return filterValidMoves(moves);
}

function getBishopMoves(currentPos) {
    const [rank, file] = positionToCoordinates(currentPos);
    const moves = [];
    for (let i = 1; i < 8; i++) {
        if (rank + i < 8 && file + i < 8) moves.push([rank + i, file + i]);
        if (rank - i >= 0 && file - i >= 0) moves.push([rank - i, file - i]);
        if (rank + i < 8 && file - i >= 0) moves.push([rank + i, file - i]);
        if (rank - i >= 0 && file + i < 8) moves.push([rank - i, file + i]);
    }
    return filterValidMoves(moves);
}

function getQueenMoves(currentPos) {
    return [
        ...getRookMoves(currentPos),
        ...getBishopMoves(currentPos)
    ];
}

function filterValidMoves(moves) {
    return moves
        .filter(([r, f]) => r >= 0 && r < 8 && f >= 0 && f < 8)
        .map(coordinatesToPosition);
}

function isCaptureSafe(move, opponentMoves) {
    return !opponentMoves.includes(move);
}

function getSafeQueenMoves(currentPos, positions) {
    const potentialMoves = getQueenMoves(currentPos);
    const opponentMoves = [
        ...getRookMoves(positions.Rook),
        ...getBishopMoves(positions.Bishop),
        ...getKnightMoves(positions.Knight)
    ];
    return potentialMoves.filter(move => isCaptureSafe(move, opponentMoves));
}

// API routes
app.post('/chess/queen', (req, res) => {
    const { positions } = req.body;
    const currentPos = positions.Queen;
    if (!currentPos) return res.status(400).json({ error: 'Queen position not provided' });
    const validMoves = getSafeQueenMoves(currentPos, positions);
    res.json({ valid_moves: validMoves });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});