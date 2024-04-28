package iewa.api.Config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQConfig {

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        return new RabbitTemplate(connectionFactory);
    }

    @Bean
    public DirectExchange syncMondayExchange() {
        return new DirectExchange("sync_monday", true, false);
    }

    @Bean
    public Queue syncMondayQueue() {
        return new Queue("sync_monday", true);
    }

    @Bean
    public Binding syncMondayBinding() {
        return BindingBuilder.bind(syncMondayQueue()).to(syncMondayExchange()).with("routing_key");
    }


    @Bean DirectExchange syncMondayIewaListExchange() {
        return new DirectExchange("sync_monday_iewa_list", true, false);
    }

    @Bean
    public Queue syncMondayIewaListQueue() {
        return new Queue("sync_monday_iewa_list", true);
    }

    @Bean
    public Binding syncMondayIewaListBinding() {
        return BindingBuilder.bind(syncMondayIewaListQueue()).to(syncMondayIewaListExchange()).with("routing_key");
    }



    @Bean DirectExchange syncInvoiceExchange() {
        return new DirectExchange("sync_invoice", true, false);
    }

    @Bean Queue syncInvoiceQueue() {
        return new Queue("sync_invoice", true);
    }

    @Bean Binding syncInvoiceBinding() {
        return BindingBuilder.bind(syncInvoiceQueue()).to(syncInvoiceExchange()).with("routing_key");
    }


    @Bean DirectExchange syncItemUpdateExchange() {
        return new DirectExchange("sync_item_update", true, false);
    }

    @Bean Queue syncItemUpdateQueue() {
        return new Queue("sync_item_update", true);
    }

    @Bean Binding syncItemUpdateBinding() {
        return BindingBuilder.bind(syncItemUpdateQueue()).to(syncItemUpdateExchange()).with("routing_key");
    }


}
