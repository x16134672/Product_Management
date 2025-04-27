# Controller for handling Product CRUD operations
class ProductsController < ApplicationController
  before_action :set_product, only: [:show, :update, :destroy]  # Find product before certain actions

  # GET /products - Get all products
  def index
    @products = Product.all  # Fetch all products from database
    render json: @products   # Send products as JSON response
  end

  # GET /products/:id - Get one product by ID
  def show
    render json: @product    # Send the found product as JSON
  end

  # POST /products - Create a new product
  def create
    @product = Product.new(product_params)  # Create new product with user data

    if @product.save  # Try to save the product
      render json: @product, status: :created  # Send product back with 201 status if saved
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity  # Send errors if validation fails
    end
  end

  # PATCH/PUT /products/:id - Update a product by ID
  def update
    if @product.update(product_params)  # Try to update the product with new data
      render json: @product             # Send updated product as JSON if successful
    else
      render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity  # Send errors if update fails
    end
  end

  # DELETE /products/:id - Delete a product by ID
  def destroy
    @product.destroy  # Delete the product
    head :no_content  # Send 204 status (no content) to confirm deletion
  end

  private

  # Find product by ID for show, update, and destroy actions
  def set_product
    @product = Product.find(params[:id])  # Look up product by ID from URL
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Product not found" }, status: :not_found  # Send 404 if product doesn’t exist
  end

  # Only allow safe parameters from user input
  def product_params
    params.require(:product).permit(:name, :description, :price, :available)  # Filter allowed fields
  end
end