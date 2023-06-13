  ngOnInit(): void {
    this.getLoggedInUser();
    this.subscriptions.push(
      this.route.queryParams.subscribe(params => {
        this.query = params['value'];
        if (this.query && this.query.trim() !== '') {
          this.getUserByNameAndEmail(this.query).subscribe(users => {
            if (users) {
              this.filteredUsers = users.filter(user =>
                user.username.toLowerCase().includes(this.query.toLowerCase()) ||
                user.email.toLowerCase().includes(this.query.toLowerCase())
              );
            } else {
              this.filteredUsers = [];
            }
          });
        }
        else {
          this.getAllUsers().subscribe(() => {
            this.filteredUsers = this.users; // when there's no search term, show all users
          })
        }
      }));
  };

  getUserByNameAndEmail(username: string): Observable<User[]> {  //receiving users by first name and last name and email 
    this.isLoading = true;
    // Added the query parameter in the API request
    return this.apiHttpService.get(`/users?q=${username}`)
      .pipe(
        tap(users => {
          this.isLoading = false;
          if (users.length !== 1) {
            console.error(`Expected 1 user for username ${username}, but got ${users.length}`);
          }
        }),
        map(users => {
          if (users.length > 0) {
            this.users = users;
            return users;
          } else {
            this.users = [];
            return [];
          }
        }),
        catchError(error => {
          this.error = error;
          this.isLoading = false;
          return of([]);
        })
      );
  }

  getAllUsers(): Observable<User[]> {
    this.isLoading = true;
    // No changes here as this was already aligned with your controller method
    const subscription = this.apiHttpService.get('/users')
      .pipe(
        tap(users => {
          this.users = users;
          this.isLoading = false;
        }),
        catchError(error => {
          this.error = error;
          this.isLoading = false;
          return of([]);
        })
      );
    return subscription;
  }
