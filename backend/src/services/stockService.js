const Stock = require('../models/Stock');
const StockMovement = require('../models/StockMovement');

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

  async getStockHistory(productId, filters) {
    const movements = await StockMovement.findByProductId(productId, filters);
    const total = await StockMovement.countByProductId(productId, filters);
    return { movements, total };
  }
}

module.exports = new StockService();
