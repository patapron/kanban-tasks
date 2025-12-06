import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Board, CreateBoardDto } from '../models/board.model';
import { TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private readonly BOARDS_KEY = 'kanban_boards';
  private readonly ACTIVE_BOARD_KEY = 'active_board_id';

  private boardsSubject = new BehaviorSubject<Board[]>([]);
  private activeBoardSubject = new BehaviorSubject<Board | null>(null);

  public boards$ = this.boardsSubject.asObservable();
  public activeBoard$ = this.activeBoardSubject.asObservable();

  private storageInitialized = false;

  constructor(private storage: Storage) {
    this.initStorage();
  }

  private async initStorage() {
    await this.storage.create();
    this.storageInitialized = true;
    await this.loadBoards();
  }

  private async loadBoards() {
    if (!this.storageInitialized) return;

    const boards = await this.storage.get(this.BOARDS_KEY);

    if (!boards || boards.length === 0) {
      // Crear tablero por defecto en el primer uso
      await this.createDefaultBoard();
    } else {
      this.boardsSubject.next(boards);

      // Cargar el tablero activo
      const activeBoardId = await this.storage.get(this.ACTIVE_BOARD_KEY);
      const activeBoard = boards.find((b: Board) => b.id === activeBoardId) || boards[0];
      this.activeBoardSubject.next(activeBoard);
    }
  }

  private async createDefaultBoard() {
    const defaultBoard: Board = {
      id: this.generateId(),
      name: 'Mi Tablero',
      description: 'Tablero principal',
      createdAt: new Date(),
      updatedAt: new Date(),
      columns: [
        {
          id: TaskStatus.TODO,
          title: 'Por Hacer',
          tasks: []
        },
        {
          id: TaskStatus.IN_PROGRESS,
          title: 'En Progreso',
          tasks: []
        },
        {
          id: TaskStatus.DONE,
          title: 'Completado',
          tasks: []
        }
      ]
    };

    await this.saveBoards([defaultBoard]);
    this.boardsSubject.next([defaultBoard]);
    this.activeBoardSubject.next(defaultBoard);
    await this.storage.set(this.ACTIVE_BOARD_KEY, defaultBoard.id);
  }

  async createBoard(dto: CreateBoardDto): Promise<Board> {
    const newBoard: Board = {
      id: this.generateId(),
      name: dto.name,
      description: dto.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      columns: [
        {
          id: TaskStatus.TODO,
          title: 'Por Hacer',
          tasks: []
        },
        {
          id: TaskStatus.IN_PROGRESS,
          title: 'En Progreso',
          tasks: []
        },
        {
          id: TaskStatus.DONE,
          title: 'Completado',
          tasks: []
        }
      ]
    };

    const boards = [...this.boardsSubject.value, newBoard];
    await this.saveBoards(boards);
    this.boardsSubject.next(boards);

    return newBoard;
  }

  async updateBoard(boardId: string, updates: Partial<Board>): Promise<void> {
    const boards = this.boardsSubject.value.map(board =>
      board.id === boardId
        ? { ...board, ...updates, updatedAt: new Date() }
        : board
    );

    await this.saveBoards(boards);
    this.boardsSubject.next(boards);

    // Actualizar tablero activo si es el que se modificó
    const activeBoard = this.activeBoardSubject.value;
    if (activeBoard?.id === boardId) {
      const updatedBoard = boards.find(b => b.id === boardId);
      if (updatedBoard) {
        this.activeBoardSubject.next(updatedBoard);
      }
    }
  }

  async deleteBoard(boardId: string): Promise<void> {
    const boards = this.boardsSubject.value.filter(b => b.id !== boardId);

    // No permitir eliminar el último tablero
    if (boards.length === 0) {
      throw new Error('No se puede eliminar el último tablero');
    }

    await this.saveBoards(boards);
    this.boardsSubject.next(boards);

    // Si se eliminó el tablero activo, activar el primero
    const activeBoard = this.activeBoardSubject.value;
    if (activeBoard?.id === boardId) {
      await this.setActiveBoard(boards[0].id);
    }
  }

  async setActiveBoard(boardId: string): Promise<void> {
    const board = this.boardsSubject.value.find(b => b.id === boardId);
    if (board) {
      this.activeBoardSubject.next(board);
      await this.storage.set(this.ACTIVE_BOARD_KEY, boardId);
    }
  }

  async updateActiveBoardColumns(columns: any[]): Promise<void> {
    const activeBoard = this.activeBoardSubject.value;
    if (!activeBoard) return;

    await this.updateBoard(activeBoard.id, { columns });
  }

  getActiveBoard(): Board | null {
    return this.activeBoardSubject.value;
  }

  getAllBoards(): Board[] {
    return this.boardsSubject.value;
  }

  private async saveBoards(boards: Board[]): Promise<void> {
    if (!this.storageInitialized) return;
    await this.storage.set(this.BOARDS_KEY, boards);
  }

  private generateId(): string {
    return `board_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
