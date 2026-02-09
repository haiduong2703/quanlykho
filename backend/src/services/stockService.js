const Stock = require('../models/Stock');

class StockService {
  async getStocks(filters) {
    const stocks = await Stock.findAll(filters);
    const total = await Stock.count(filters);
    return { stocks, total };
  }

  async getStockByProductId(productId) {
    const stock = await Stock.findByProductId(productId);
    if (!stock) throw new Error('Stock not found');
    return stock;
  }

  async getLowStockAlerts() {
    return await Stock.findLowStock();
  }

  async getTotalStockValue() {
    return await Stock.getTotalStockValue();
  }
}

module.exports = new StockService();
