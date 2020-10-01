import { TestBed } from '@angular/core/testing';
import { AddBookComponent } from './add-book.component';
import { IAuthor } from 'src/app/core/models/author';
import { IGenre } from 'src/app/core/models/genre';

// Testing of AddBookComponent
describe('#AddBookComponent .addAuthor(), .getGenreById(id), .isAuthorTyped(string), .checkAutorLastName(string)', () => {
  let addBookComponent: AddBookComponent;

  beforeEach(() => {
    // Configures testing app module
    TestBed.configureTestingModule({
      providers: [AddBookComponent],
    });

    // Instantaites AddBookComponent
    addBookComponent = new AddBookComponent(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
  });

  // Test case 1
  it('should add author to list', () => {
    const author: IAuthor = {
      id: 1,
      firstName: 'Andriy',
      lastName: 'Oleksiuk',
      isConfirmed: true,
    };
    const authors: IAuthor[] = [];

    addBookComponent.addAuthor(authors, author);

    expect(authors).toContain(
      author,
      'authors should contain newly added IAuthor'
    );
  });

  // Test case 2
  it('should return existing genre name by id', () => {
    const genreId = 1;
    const newGenre: IGenre = {
      id: genreId,
      name: 'Fantasy',
      nameUk: 'Фантазія'
    };
    addBookComponent.genres = [newGenre];

    expect(addBookComponent.getGenreById(genreId)).toEqual(newGenre.name);
  });

  // Test case 3
  it('should return false because author name is invalid', () => {
    const authorName = '338*--23';

    expect(addBookComponent.isAuthorTyped(authorName)).toBeFalse();
  });

  // Test case 4
  it('should return true because author last name is valid', () => {
    const authorName = 'Andriy Oleksiuk';

    expect(addBookComponent.checkAuthorLastName(authorName)).toBeTrue();
  });

  // Test case 5
  it('should return false because author last name is invalid', () => {
    const authorName = '338*--23';

    expect(addBookComponent.isAuthorTyped(authorName)).toBeFalse();
  });
});
