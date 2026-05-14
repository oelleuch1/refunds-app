Phase 1: The Contract (Domain & Application)
  Goal: Define how data should look and how we request it.

   1. Define the Pagination Model in shared/application/models
       * Task: Create a generic PaginationResponse<T> class and a PaginationRequest interface 

   2. Update the Repository Port:
       * Task: Modify ICustomersRepository to change getCustomers() from returning Customer[] to
         Promise<PaginationResponse<Customer>>, accepting a PaginationRequest.

Phase 2: The Data Source (Infrastructure)
Goal: Fetching real data from the outside world.

   3. Implement Server-Side Paging:
       * Task: Update CustomersRemoteDatasource to use Supabase's .range(from, to) and return the {
         count }.

   4. Create a PaginationMapper:
       * Task: Build a PaginationResponseMapper that can convert a PaginationResponseDTO<CustomerDTO>
         into the domain-friendly PaginationResponse<Customer>.

Phase 3: The Connection (Dependency Injection)
Goal: Decoupling the UI from the implementation.

   5. Inject Use Cases via Context:
       * Task: In CustomersPage, remove the direct import of USE_CASES. Use the @consume decorator to
         get the AppUseCases from the Lit context.

Phase 4: The Interactive UI (Presentation)
Goal: Making the page "alive".

   6. API connection on the page:
       * Task: 
            * Update the customers page to be connected to API to load customers

   6. Search customers
        * Task: 
            * Implement everything related to search customers by (Email, Id and name)

   7. Responsive Grid & Events:
       * Task: 
           * Implement a generic Table Component With Pagination
           * When Pagination Change, Emit event so the parent will load again the data
           * When Row/Cell is clicked, Emit event so the parent will call a function if needed


**
Expected:
Call API to get Customers
Display them with pagination
Search for Customers by Email, Id or Name
**