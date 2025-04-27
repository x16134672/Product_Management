# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
Product.create([
  { name: 'Banana', price: 2.25, available: true, description: 'Big green banana from Africa' },
  { name: 'Apple', price: 1.89, available: true, description: 'Sweet red apple from southern Spain' },
  { name: 'Mango', price: 3.75, available: true, description: 'Big sweet mango from Brazil' },
  { name: 'Tomato', price: 2.45, available: false, description: 'Sweet cherry tomato from Portugal' },
  { name: 'Red Cherry', price: 4.45, available: true, description: 'Big red sweet-sour cherry from Croatia' },
  { name: 'Peach', price: 3.01, available: false, description: 'Super sweet peach from Argentina' }
])
