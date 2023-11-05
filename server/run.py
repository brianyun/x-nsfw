import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist

# Load the data from the CSV file
file_path = './niche.csv'
data = pd.read_csv(file_path)

# Download the necessary resources from the NLTK library
nltk.download('punkt')
nltk.download('stopwords')

# Tokenize the subreddit titles
tokens = [word.lower() for title in data['description'] for word in word_tokenize(title)]

# Remove stopwords
stop_words = set(stopwords.words('english'))
filtered_tokens = [word for word in tokens if word not in stop_words]

# Create a frequency distribution of the words
freq_dist = FreqDist(filtered_tokens)

# Display the most common words
print(freq_dist.most_common(10))
