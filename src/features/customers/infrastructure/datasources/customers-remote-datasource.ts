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
