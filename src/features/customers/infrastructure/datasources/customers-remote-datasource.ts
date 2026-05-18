/**
 * CUSTOMER SEARCH — step 2
 * - Add searchCustomers({ query, field, page, pageSize }) → { items, total }
 * - Filters: ilike on full_name / email / id, or .or() for "all"
 * - .select('*', { count: 'exact' }).range(from, to)
 */
import type { CustomerDTO } from "@features/customers/infrastructure/dtos/customer-dto";
import { supabase } from '@shared/infrastructure/supabase/supabase'

export class CustomersRemoteDatasource {

  async getCustomers(): Promise<CustomerDTO[]> {
    const { data: customers, error } = await supabase.from('customers')
      .select<'*', CustomerDTO>('*')
      .range(0, 9);

    if (error) {
      throw new Error(`Error fetching customers: ${error.message}`);
    }

    return customers;
  }

}
