module Test
    class DatabasesController < ActionController::API
      require 'factory_bot'
  
      def reset_database
        unless Rails.env.test?
          render json: { error: 'Route only available in test environment' }, status: :forbidden
          return
        end
  
        begin
          # Reset database
          ActiveRecord::Base.connection.tables.each do |table|
            next if table == 'schema_migrations' || table == 'ar_internal_metadata'
            ActiveRecord::Base.connection.execute("DELETE FROM #{table}")
            ActiveRecord::Base.connection.execute("DELETE FROM sqlite_sequence WHERE name='#{table}'") if ActiveRecord::Base.connection.adapter_name == 'SQLite'
          end
  
          # Seed test data
          product = FactoryBot.create(:product, name: 'Laptop', price: 999.99, available: true, description: 'A high-end laptop')
          FactoryBot.create(:product, name: 'Mouse', price: 19.99, available: false, description: 'A wireless mouse')
  
          render json: { status: 'success', product_id: product.id }, status: :ok
        rescue StandardError => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end
    end
  end