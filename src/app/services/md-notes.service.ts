import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MdNotesService {
    
  mdNote:any;
  mdBooks:any;

  //OBSERVABLE FOR SEARCH RESULTS
  public searchNotes = [];
  private searchChange: Subject<any> = new Subject(); 
  searchChange$: Observable<any> = this.searchChange.asObservable();


  constructor(
    private httpClient: HttpClient,
  ) { }
  
  private API_URL = environment.API_URL;

  private setSearchNotes(updatedSearch) {
    this.searchNotes = updatedSearch;
    this.searchChange.next(updatedSearch);
    return updatedSearch;
  } 

  //UPDATE OBSERVABLE: SEARCH RESULTS ARRAY
  updateSearch(search){
    const options = { withCredentials: true };
    const results = { search };
    return this.httpClient.post(`${this.API_URL}/mdnotes/search`, results, options).toPromise()
    .then(mdBooks => {
      this.mdBooks = mdBooks;
      this.highlightSearchstring(this.mdBooks, search)
      this.setSearchNotes(this.mdBooks);
    })
    .catch(err => {
      console.error(err);
    });
  }
  mdNotesArr = [];

  // PASS SEARCH STRING AND RETURNED CONTENT THROUGH HIGHLIGHT PARSER
  highlightSearchstring(books: any, search: any): any {
    if (search && books) {
      books.forEach(mdBook => {
        this.mdNotesArr = mdBook.mdNotes;
        this.mdNotesArr.forEach(note=> {
          note.content = String(note.content); // make sure its a string
          let startIndex = note.content.toLowerCase().indexOf(search.toLowerCase());
          let endLength = search.length;
          let matchingString = note.content.substr(startIndex, endLength); 
          note.content = note.content.replace(matchingString, "<mark>" + matchingString + "</mark>");
        })
      })
    }
    return books;
}

  //GET ONE NOTE - ID: Note - REQ.PARAMS;
  getOne(id){
    const options = {
      withCredentials: true
    };
    return this.httpClient.get(`${this.API_URL}/mdnotes/${id}`, options).toPromise();
  }
  // Get 6 latest updated notes
  getLatest(){
    const options = {
      withCredentials: true
    };
    return this.httpClient.get(`${this.API_URL}/mdnotes/latest`, options).toPromise();
  }
  getPinned(){
    const options = {
      withCredentials: true
    };
    return this.httpClient.get(`${this.API_URL}/mdnotes/pinned`, options).toPromise();
  }
  //EDIT NOTE - ID: Note - REQ.PARAMS; { title, content } = req.body;
  edit(id, data){
    const options = {
      withCredentials: true
    };
    return this.httpClient.put(`${this.API_URL}/mdnotes/${id}`, data, options).toPromise();
  }
  editNewTitle(id, data){
    const options = {
      withCredentials: true
    };
    return this.httpClient.put(`${this.API_URL}/mdnotes/${id}/title`, data, options).toPromise();
  }
  pin(id, status){
    const options = {
      withCredentials: true
    };
    const pinned = { status };
    return this.httpClient.put(`${this.API_URL}/mdnotes/${id}/pin`, pinned, options).toPromise() 
  }

  //DELETE NOTE - ID: Note - REQ.PARAMS;
  delete(id){
    const options = {
      withCredentials: true
    };
    return this.httpClient.delete(`${this.API_URL}/mdnotes/${id}`, options).toPromise()
  }

  //CREATE NEW NOTE - ID: Book - REQ.PARAMS, DATA: const { title, content } = req.body;
  new(data, id){
    const options = {
      withCredentials: true
    }
    return this.httpClient.post(`${this.API_URL}/mdbooks/${id}/new`, data, options).toPromise();
  }
  
}
