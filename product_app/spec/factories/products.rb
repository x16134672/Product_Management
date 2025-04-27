FactoryBot.define do
    factory :product do
      name { Faker::Commerce.product_name }
      description { Faker::Lorem.sentence }
      price { Faker::Commerce.price(range: 10..1000) }
      available { [true, false].sample }
    end
  end