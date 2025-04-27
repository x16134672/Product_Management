require "test_helper"

class ProductTest < ActiveSupport::TestCase
  test "should save valid product" do
    product = Product.new(name: "Hammer", price: 15.99)
    assert product.save
  end

  test "should not save product without name" do
    product = Product.new(price: 9.99)
    assert_not product.save
  end

  test "should not save product without price" do
    product = Product.new(name: "Screwdriver")
    assert_not product.save
  end

  test "should default available to true" do
    product = Product.new(name: "Wrench", price: 5.0)
    product.save
    assert product.available
  end
end