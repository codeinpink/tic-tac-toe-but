class GridPositionOutOfBounds(Exception):
    pass

class GridPositionNotEmpty(Exception):
    pass

class NotPlayerTurn(Exception):
    pass

class TicTacToe():
    grid = None
    player1 = None
    player2 = None
    turn = None

    @property
    def tied(self):
        return all(all(row) for row in self.grid) and not self.winner

    @property
    def winner(self):
        # row 1
        if (self.grid[0][0] and self.grid[0][1] and self.grid[0][2]) and \
        (self.grid[0][0] == self.grid[0][1] == self.grid[0][2]):
            return self.grid[0][0]

        # diagonal from row 1, column 1
        if (self.grid[0][0] and self.grid[1][1] and self.grid[2][2]) and \
        (self.grid[0][0] == self.grid[1][1] == self.grid[2][2]):
            return self.grid[0][0]

        # column 1
        if (self.grid[0][0] and self.grid[1][0] and self.grid[2][0]) and \
        (self.grid[0][0] == self.grid[1][0] == self.grid[2][0]):
            return self.grid[0][0]

        # column 2
        if (self.grid[0][1] and self.grid[1][1] and self.grid[2][1]) and \
        (self.grid[0][1] == self.grid[1][1] == self.grid[2][1]):
            return self.grid[0][1]

        # column 3
        if (self.grid[0][2] and self.grid[1][2] and self.grid[2][2]) and \
        (self.grid[0][2] == self.grid[1][2] == self.grid[2][2]):
            return self.grid[0][2]

        # diagonal from row 1, column 3
        if (self.grid[0][2] and self.grid[1][1] and self.grid[2][0]) and \
        (self.grid[0][2] == self.grid[1][1] == self.grid[2][0]):
            return self.grid[0][2]

        # row 2
        if (self.grid[1][0] and self.grid[1][1] and self.grid[1][2]) and \
        (self.grid[1][0] == self.grid[1][1] == self.grid[1][2]):
            return self.grid[1][0]

        # row 3
        if (self.grid[2][0] and self.grid[2][1] and self.grid[2][2]) and \
        (self.grid[2][0] == self.grid[2][1] == self.grid[2][2]):
            return self.grid[2][0]

        return None

    @property
    def over(self):
        return bool(self.winner) or bool(self.tied)

    def __init__(self, player1='X', player2='O'):
        self.grid = [[None for x in range(3)] for y in range(3)]
        self.player1 = player1
        self.player2 = player2
        self.turn = self.player1

    def next_turn(self, player, x, y):
        if player is not self.turn:
            raise NotPlayerTurn(f'It is not player {player}\'s turn')

        if x < 0 or x > 2 or y < 0 or y > 2:
            raise GridPositionOutOfBounds('Pick a position on the grid, idiot')
        
        if self.grid[x][y]:
            raise GridPositionNotEmpty(f'Position {x}, {y} taken')
        
        self.grid[x][y] = player

        if self.winner or self.tied:
            return True
        else:
            self.turn = self.player2 if self.player1 == self.turn else self.player1
            return False

    def __str__(self):
        return str(self.grid)