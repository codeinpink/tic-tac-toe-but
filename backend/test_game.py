import unittest
from game import TicTacToe, GridPositionOutOfBounds, GridPositionNotEmpty


class TestTicTacToe(unittest.TestCase):

    def setUp(self):
        self.game = TicTacToe()

    def test_not_tied(self):
        self.game.next_turn('X', 0, 0)
        self.game.next_turn('X', 1, 1)
        self.game.next_turn('X', 2, 0)
        self.assertFalse(self.game.tied)

    def test_not_tied_empty(self):
        self.assertFalse(self.game.tied)

    def test_not_tied_winner(self):
        self.game.next_turn('X', 0, 0)
        self.game.next_turn('X', 1, 0)
        self.game.next_turn('X', 2, 0)
        self.assertFalse(self.game.tied)

    def test_tied(self):
        self.game.next_turn('X', 0, 0)
        self.game.next_turn('O', 0, 1)
        self.game.next_turn('X', 0, 2)

        self.game.next_turn('O', 1, 0)
        self.game.next_turn('O', 1, 1)
        self.game.next_turn('X', 1, 2)

        self.game.next_turn('O', 2, 0)
        self.game.next_turn('X', 2, 1)
        self.game.next_turn('O', 2, 2)

    def test_next_turn_set_position(self):
        self.assertEqual(self.game.grid[0][0], None)
        self.game.next_turn('X', 0, 0)
        self.assertEqual(self.game.grid[0][0], 'X')

    def test_next_turn_winner_row_1(self):
        self.assertEqual(self.game.winner, None)
        self.assertFalse(self.game.next_turn('X', 0, 0))
        self.assertFalse(self.game.next_turn('X', 0, 1))
        self.assertTrue(self.game.next_turn('X', 0, 2))
        self.assertEqual(self.game.winner, 'X')

    def test_next_turn_winner_diag_row_1_col_1(self):
        self.assertEqual(self.game.winner, None)
        self.assertFalse(self.game.next_turn('X', 0, 0))
        self.assertFalse(self.game.next_turn('X', 1, 1))
        self.assertTrue(self.game.next_turn('X', 2, 2))
        self.assertEqual(self.game.winner, 'X')

    def test_next_turn_winner_col_1(self):
        self.assertEqual(self.game.winner, None)
        self.assertFalse(self.game.next_turn('X', 0, 0))
        self.assertFalse(self.game.next_turn('X', 1, 0))
        self.assertTrue(self.game.next_turn('X', 2, 0))
        self.assertEqual(self.game.winner, 'X')

    def test_next_turn_winner_row_2(self):
        self.assertEqual(self.game.winner, None)
        self.assertFalse(self.game.next_turn('X', 1, 0))
        self.assertFalse(self.game.next_turn('X', 1, 1))
        self.assertTrue(self.game.next_turn('X', 1, 2))
        self.assertEqual(self.game.winner, 'X')

    def test_next_turn_winner_col_2(self):
        self.assertEqual(self.game.winner, None)
        self.assertFalse(self.game.next_turn('X', 0, 1))
        self.assertFalse(self.game.next_turn('X', 1, 1))
        self.assertTrue(self.game.next_turn('X', 2, 1))
        self.assertEqual(self.game.winner, 'X')

    def test_next_turn_winner_row_3(self):
        self.assertEqual(self.game.winner, None)
        self.assertFalse(self.game.next_turn('O', 2, 0))
        self.assertFalse(self.game.next_turn('O', 2, 1))
        self.assertTrue(self.game.next_turn('O', 2, 2))
        self.assertEqual(self.game.winner, 'O')

    def test_next_turn_winner_col_3(self):
        self.assertEqual(self.game.winner, None)
        self.assertFalse(self.game.next_turn('O', 0, 2))
        self.assertFalse(self.game.next_turn('O', 1, 2))
        self.assertTrue(self.game.next_turn('O', 2, 2))
        self.assertEqual(self.game.winner, 'O')

    def test_next_turn_winner_diag_row_1_col_3(self):
        self.assertEqual(self.game.winner, None)
        self.assertFalse(self.game.next_turn('O', 0, 2))
        self.assertFalse(self.game.next_turn('O', 1, 1))
        self.assertTrue(self.game.next_turn('O', 2, 0))
        self.assertEqual(self.game.winner, 'O')

    def test_next_turn_no_winner(self):
        self.assertEqual(self.game.winner, None)
        self.assertFalse(self.game.next_turn('X', 0, 0))
        self.assertEqual(self.game.winner, None)

    def test_next_turn_tied(self):
        self.assertEqual(self.game.winner, None)

        self.game.next_turn('X', 0, 0)
        self.game.next_turn('O', 0, 1)
        self.game.next_turn('X', 0, 2)

        self.game.next_turn('O', 1, 0)
        self.game.next_turn('O', 1, 1)
        self.game.next_turn('X', 1, 2)

        self.game.next_turn('O', 2, 0)
        self.game.next_turn('X', 2, 1)
        self.assertTrue(self.game.next_turn('O', 2, 2))
        self.assertEqual(self.game.winner, None)

    def test_next_turn_bad_positions(self):
        with self.assertRaises(GridPositionOutOfBounds):
            self.game.next_turn('X', -1, -1)

        with self.assertRaises(GridPositionOutOfBounds):
            self.game.next_turn('X', -1, 1)

        with self.assertRaises(GridPositionOutOfBounds):
            self.game.next_turn('X', 1, -1)

        with self.assertRaises(GridPositionOutOfBounds):
            self.game.next_turn('X', 4, 4)

        with self.assertRaises(GridPositionOutOfBounds):
            self.game.next_turn('X', 4, 1)

        with self.assertRaises(GridPositionOutOfBounds):
            self.game.next_turn('X', 1, 4)

    def test_next_turn_position_taken(self):
        self.game.next_turn('O', 0, 0)

        with self.assertRaises(GridPositionNotEmpty):
            self.game.next_turn('X', 0, 0)


if __name__ == '__main__':
    unittest.main()